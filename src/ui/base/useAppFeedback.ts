"use client";

import { App, type ModalFuncProps } from "antd";
import { resolveErrorMessage } from "@/utils/errors";

type ConfirmOptions = {
  cancelText?: string;
  content?: ModalFuncProps["content"];
  danger?: boolean;
  okText?: string;
  title: ModalFuncProps["title"];
};

export function useAppFeedback() {
  const { modal, notification } = App.useApp();

  function notifyError(
    error: unknown,
    options?: {
      fallback?: string;
      title?: string;
    },
  ) {
    const description = resolveErrorMessage(
      error,
      options?.fallback ?? "Ocorreu um erro inesperado.",
    );

    notification.error({
      title: options?.title ?? "Não foi possível concluir a ação",
      description,
      placement: "topRight",
    });

    return description;
  }

  function notifySuccess(
    description: string,
    options?: {
      title?: string;
    },
  ) {
    notification.success({
      title: options?.title ?? "Ação concluída",
      description,
      placement: "topRight",
    });
  }

  function confirm(options: ConfirmOptions): Promise<boolean> {
    return new Promise((resolve) => {
      let settled = false;

      function finish(value: boolean) {
        if (settled) return;
        settled = true;
        resolve(value);
      }

      modal.confirm({
        title: options.title,
        content: options.content,
        okText: options.okText ?? "Confirmar",
        cancelText: options.cancelText ?? "Cancelar",
        okButtonProps: options.danger ? { danger: true } : undefined,
        centered: true,
        onOk: () => finish(true),
        onCancel: () => finish(false),
      });
    });
  }

  return {
    confirm,
    notifyError,
    notifySuccess,
  };
}
