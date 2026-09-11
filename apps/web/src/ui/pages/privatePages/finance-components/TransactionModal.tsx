"use client";

import { type FormEvent, useState } from "react";
import { FiArrowDownRight, FiArrowUpRight, FiDollarSign } from "react-icons/fi";
import { createTransactionAction } from "@/actions/(private)/finance";
import type { FinanceOption, TransactionType } from "@/lib/finance-utils";
import { Button } from "@/ui/base/Button";
import { Modal } from "@/ui/base/Modal";
import { useAppFeedback } from "@/ui/base/useAppFeedback";

type TransactionModalProps = {
  accounts: FinanceOption[];
  categories: (FinanceOption & { type: TransactionType })[];
  contacts: FinanceOption[];
  onClose: () => void;
  open: boolean;
};

export function TransactionModal({
  open,
  onClose,
  accounts,
  categories,
  contacts,
}: TransactionModalProps) {
  const { notifyError, notifySuccess } = useAppFeedback();
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<TransactionType>("income");
  const [description, setDescription] = useState("");
  const [valueInput, setValueInput] = useState("");
  const [dueAt, setDueAt] = useState(() =>
    new Date().toISOString().slice(0, 10),
  );
  const [contactId, setContactId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [accountId, setAccountId] = useState(accounts[0]?.id || "");
  const [paidNow, setPaidNow] = useState(false);

  const availableCategories = categories.filter((c) => c.type === type);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      notifyError("Informe a descrição da movimentação.");
      return;
    }
    if (!valueInput.trim()) {
      notifyError("Informe o valor da movimentação.");
      return;
    }

    setLoading(true);
    try {
      const res = await createTransactionAction({
        type,
        description: description.trim(),
        valueInput: valueInput.trim(),
        dueAt,
        contactId: contactId || null,
        categoryId: categoryId || null,
        accountId: accountId || null,
        paidNow,
      });

      if (res?.data?.ok) {
        notifySuccess(
          type === "income"
            ? "Receita lançada com sucesso!"
            : "Despesa lançada com sucesso!",
        );
        onClose();
        setDescription("");
        setValueInput("");
        setPaidNow(false);
      } else {
        notifyError(res?.serverError || "Erro ao salvar movimentação.");
      }
    } catch (_err) {
      notifyError("Erro inesperado ao criar movimentação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
            <FiDollarSign className="h-4 w-4" />
          </div>
          <span className="font-bold text-base">
            Nova Movimentação Financeira
          </span>
        </div>
      }
      testid="finance-transaction-modal"
    >
      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
        {/* Toggle Tipo: Receita vs Despesa */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-(--color-base-2) border border-(--color-border)">
          <button
            type="button"
            onClick={() => setType("income")}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
              type === "income"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-(--color-text-2) hover:text-(--color-text)"
            }`}
          >
            <FiArrowUpRight className="h-4 w-4" />
            <span>Receita (+)</span>
          </button>
          <button
            type="button"
            onClick={() => setType("expense")}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
              type === "expense"
                ? "bg-rose-600 text-white shadow-xs"
                : "text-(--color-text-2) hover:text-(--color-text)"
            }`}
          >
            <FiArrowDownRight className="h-4 w-4" />
            <span>Despesa (-)</span>
          </button>
        </div>

        {/* Descrição */}
        <div>
          <label
            htmlFor="tx-description"
            className="block text-xs font-semibold text-(--color-text) mb-1"
          >
            Descrição *
          </label>
          <input
            id="tx-description"
            type="text"
            required
            placeholder="Ex: Manutenção Elétrica ou Combustível"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border border-(--color-border) bg-(--color-base-2) px-3 py-2 text-sm text-(--color-text) placeholder:text-(--color-text-2) focus:border-emerald-500 focus:outline-hidden"
            data-testid="transaction-description-input"
          />
        </div>

        {/* Valor e Vencimento */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="tx-value"
              className="block text-xs font-semibold text-(--color-text) mb-1"
            >
              Valor (R$) *
            </label>
            <input
              id="tx-value"
              type="text"
              required
              placeholder="0,00"
              value={valueInput}
              onChange={(e) => setValueInput(e.target.value)}
              className="w-full rounded-lg border border-(--color-border) bg-(--color-base-2) px-3 py-2 text-sm font-semibold text-(--color-text) placeholder:text-(--color-text-2) focus:border-emerald-500 focus:outline-hidden"
              data-testid="transaction-value-input"
            />
          </div>
          <div>
            <label
              htmlFor="tx-due-date"
              className="block text-xs font-semibold text-(--color-text) mb-1"
            >
              Data de Vencimento
            </label>
            <input
              id="tx-due-date"
              type="date"
              value={dueAt}
              onChange={(e) => setDueAt(e.target.value)}
              className="w-full rounded-lg border border-(--color-border) bg-(--color-base-2) px-3 py-2 text-sm text-(--color-text) focus:border-emerald-500 focus:outline-hidden"
              data-testid="transaction-due-date-input"
            />
          </div>
        </div>

        {/* Cliente / Fornecedor */}
        <div>
          <label
            htmlFor="tx-contact"
            className="block text-xs font-semibold text-(--color-text) mb-1"
          >
            Cliente / Contato (Opcional)
          </label>
          <select
            id="tx-contact"
            value={contactId}
            onChange={(e) => setContactId(e.target.value)}
            className="w-full rounded-lg border border-(--color-border) bg-(--color-base-2) px-3 py-2 text-sm text-(--color-text) focus:border-emerald-500 focus:outline-hidden"
            data-testid="transaction-contact-select"
          >
            <option value="">Selecione um cliente (opcional)...</option>
            {contacts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Categoria e Conta */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="tx-category"
              className="block text-xs font-semibold text-(--color-text) mb-1"
            >
              Categoria
            </label>
            <select
              id="tx-category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-lg border border-(--color-border) bg-(--color-base-2) px-3 py-2 text-sm text-(--color-text) focus:border-emerald-500 focus:outline-hidden"
            >
              <option value="">Geral / Padrão</option>
              {availableCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="tx-account"
              className="block text-xs font-semibold text-(--color-text) mb-1"
            >
              Conta Bancária
            </label>
            <select
              id="tx-account"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="w-full rounded-lg border border-(--color-border) bg-(--color-base-2) px-3 py-2 text-sm text-(--color-text) focus:border-emerald-500 focus:outline-hidden"
            >
              <option value="">Conta Principal</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Checkbox: Já Pago */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="paidNowCheckbox"
            checked={paidNow}
            onChange={(e) => setPaidNow(e.target.checked)}
            className="h-4 w-4 rounded border-(--color-border) text-emerald-600 focus:ring-emerald-500"
            data-testid="transaction-paid-now-checkbox"
          />
          <label
            htmlFor="paidNowCheckbox"
            className="text-xs text-(--color-text) cursor-pointer"
          >
            Marcar como <strong>já pago/recebido</strong> agora
          </label>
        </div>

        {/* Ações do Modal */}
        <div className="mt-4 flex items-center justify-end gap-2 border-t border-(--color-border) pt-4">
          <Button
            fit
            onClick={onClose}
            disabled={loading}
            testid="modal-cancel"
          >
            Cancelar
          </Button>
          <Button
            fit
            htmlType="submit"
            loading={loading}
            type="primary"
            testid="modal-submit"
            className="bg-emerald-600 hover:bg-emerald-500 text-white"
          >
            Salvar Lançamento
          </Button>
        </div>
      </form>
    </Modal>
  );
}
