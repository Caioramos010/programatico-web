import { create } from "zustand";

/**
 * Rascunhos de formulário em memória (contexto da sessão SPA): se o usuário
 * navegar no meio do preenchimento (ex.: abrir os termos) e voltar, os campos
 * são restaurados. Intencionalmente SEM persist — senhas e dados de cadastro
 * nunca tocam o localStorage; um refresh limpa tudo.
 */
interface FormDraftState {
  drafts: Record<string, Record<string, string>>;
  saveDraft: (form: string, values: Record<string, string>) => void;
  clearDraft: (form: string) => void;
}

export const useFormDraftStore = create<FormDraftState>((set) => ({
  drafts: {},
  saveDraft: (form, values) =>
    set((state) => ({ drafts: { ...state.drafts, [form]: values } })),
  clearDraft: (form) =>
    set((state) => {
      const drafts = { ...state.drafts };
      delete drafts[form];
      return { drafts };
    }),
}));
