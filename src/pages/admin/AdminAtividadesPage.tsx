import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight, Zap, Plus, Pencil, Trash2, X, Upload } from "lucide-react";
import { adminService, type Exercise, type ExerciseRequest } from "../../services/adminService";
import { parseApiError } from "../../utils/parseApiError";

type ExType = "PAIRS" | "DRAG_DROP" | "MULTIPLE_CHOICE";

const EX_TYPE_LABEL: Record<ExType, string> = {
  PAIRS: "Combine Pares",
  DRAG_DROP: "Fluxo Lógico",
  MULTIPLE_CHOICE: "Alternativa Correta",
};

const EX_TYPE_COLOR: Record<ExType, string> = {
  PAIRS: "bg-purple-500/15 text-purple-400",
  DRAG_DROP: "bg-blue-500/15 text-blue-400",
  MULTIPLE_CHOICE: "bg-green-500/15 text-green-400",
};

interface Pair { left: string; right: string }
interface McOption { image: string; description: string; correct: boolean }

interface FormStep1 {
  exerciseType: ExType;
  statement: string;
  tags: string[];
  tagInput: string;
  imageData: string;
}

interface FormStep2 {
  xpReward: number;
  pairs: Pair[];
  dragItems: string[];
  mcOptions: McOption[];
}

const defaultPairs = (): Pair[] => Array.from({ length: 4 }, () => ({ left: "", right: "" }));
const defaultDragItems = (): string[] => ["", "", ""];
const defaultMcOptions = (): McOption[] => Array.from({ length: 4 }, () => ({ image: "", description: "", correct: false }));

function buildExerciseData(type: ExType, step2: FormStep2): string {
  if (type === "PAIRS") {
    const pairs = step2.pairs.filter((p) => p.left.trim() && p.right.trim());
    return JSON.stringify({ pairs });
  }
  if (type === "DRAG_DROP") {
    const items = step2.dragItems.filter((it) => it.trim());
    return JSON.stringify({ items });
  }
  const options = step2.mcOptions.filter((o) => o.description.trim());
  return JSON.stringify({ options });
}

function parseExerciseData(exercise: Exercise): { pairs: Pair[]; dragItems: string[]; mcOptions: McOption[] } {
  try {
    const data = JSON.parse(exercise.exerciseData);
    if (exercise.exerciseType === "PAIRS") return { pairs: data.pairs ?? defaultPairs(), dragItems: defaultDragItems(), mcOptions: defaultMcOptions() };
    if (exercise.exerciseType === "DRAG_DROP") return { pairs: defaultPairs(), dragItems: data.items ?? defaultDragItems(), mcOptions: defaultMcOptions() };
    return { pairs: defaultPairs(), dragItems: defaultDragItems(), mcOptions: data.options ?? defaultMcOptions() };
  } catch {
    return { pairs: defaultPairs(), dragItems: defaultDragItems(), mcOptions: defaultMcOptions() };
  }
}

function parseTags(raw: string | null): string[] {
  if (!raw) return [];
  try { return JSON.parse(raw); } catch { return []; }
}

const inputCls =
  "w-full rounded-xl px-4 py-2.5 text-sm bg-[var(--color-bg-card-inner)] text-[var(--color-text-primary)] border border-[var(--color-gray-border)] outline-none focus:border-[var(--color-accent-light)] transition-colors placeholder:text-[var(--color-text-muted)]";

export default function AdminAtividadesPage() {
  const { moduloId } = useParams<{ moduloId: string }>();
  const { state } = useLocation();
  const navigate = useNavigate();
  const moduloTitle: string = state?.moduloTitle ?? `Módulo #${moduloId}`;
  const trackTitle: string = state?.trackTitle ?? "";

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [step, setStep] = useState<1 | 2>(1);

  const [step1, setStep1] = useState<FormStep1>({
    exerciseType: "PAIRS",
    statement: "",
    tags: [],
    tagInput: "",
    imageData: "",
  });
  const [step2, setStep2] = useState<FormStep2>({
    xpReward: 5,
    pairs: defaultPairs(),
    dragItems: defaultDragItems(),
    mcOptions: defaultMcOptions(),
  });

  const imageRef = useRef<HTMLInputElement>(null);
  const mcImageRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const carregar = async () => {
    if (!moduloId) return;
    try {
      const data = await adminService.listarExercicios(Number(moduloId));
      setExercises(data);
    } catch {
      setPageError("Erro ao carregar atividades.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { carregar(); }, [moduloId]);

  const abrirCriar = () => {
    setEditingId(null);
    setStep(1);
    setStep1({ exerciseType: "PAIRS", statement: "", tags: [], tagInput: "", imageData: "" });
    setStep2({ xpReward: 5, pairs: defaultPairs(), dragItems: defaultDragItems(), mcOptions: defaultMcOptions() });
    setFormError(null);
    setShowModal(true);
  };

  const abrirEditar = (e: React.MouseEvent, ex: Exercise) => {
    e.stopPropagation();
    const parsed = parseExerciseData(ex);
    setEditingId(ex.id);
    setStep(1);
    setStep1({ exerciseType: ex.exerciseType, statement: ex.statement, tags: parseTags(ex.tags), tagInput: "", imageData: ex.imageData ?? "" });
    setStep2({ xpReward: ex.xpReward, ...parsed });
    setFormError(null);
    setShowModal(true);
  };

  const fecharModal = () => { setShowModal(false); setFormError(null); };

  const avancarStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!step1.statement.trim()) { setFormError("Preencha o enunciado."); return; }
    setFormError(null);
    setStep(2);
  };

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validações de conteúdo por tipo
    if (step1.exerciseType === "PAIRS") {
      const paresFiltrados = step2.pairs.filter((p) => p.left.trim() || p.right.trim());
      if (paresFiltrados.length < 2) { setFormError("Adicione pelo menos 2 pares."); return; }
      const parIncompleto = paresFiltrados.find((p) => !p.left.trim() || !p.right.trim());
      if (parIncompleto) { setFormError("Todos os pares devem ter os dois lados preenchidos."); return; }
    }

    if (step1.exerciseType === "DRAG_DROP") {
      const itensFiltrados = step2.dragItems.filter((it) => it.trim());
      if (itensFiltrados.length < 2) { setFormError("Adicione pelo menos 2 passos."); return; }
      const itemVazio = step2.dragItems.some((it) => !it.trim());
      if (itemVazio) { setFormError("Todos os passos devem ser preenchidos ou remova os vazios."); return; }
    }

    if (step1.exerciseType === "MULTIPLE_CHOICE") {
      const opcoesFiltradas = step2.mcOptions.filter((o) => o.description.trim());
      if (opcoesFiltradas.length < 2) { setFormError("Adicione pelo menos 2 alternativas com descrição."); return; }
      const correta = step2.mcOptions.find((o) => o.correct);
      if (!correta) { setFormError("Marque uma alternativa correta (duplo clique na alternativa)."); return; }
      if (!correta.description.trim()) { setFormError("A alternativa correta deve ter uma descrição."); return; }
    }

    const payload: ExerciseRequest = {
      statement: step1.statement,
      exerciseType: step1.exerciseType,
      exerciseData: buildExerciseData(step1.exerciseType, step2),
      xpReward: step2.xpReward,
      tags: JSON.stringify(step1.tags),
      imageData: step1.imageData || undefined,
    };
    setIsSaving(true);
    try {
      if (editingId !== null) {
        const updated = await adminService.atualizarExercicio(editingId, payload);
        setExercises((prev) => prev.map((ex) => (ex.id === editingId ? updated : ex)));
      } else {
        const novo = await adminService.criarExercicio(Number(moduloId), payload);
        setExercises((prev) => [...prev, novo]);
      }
      fecharModal();
    } catch (err) {
      const { formError: msg } = parseApiError(err);
      setFormError(msg ?? "Erro ao salvar atividade.");
    } finally {
      setIsSaving(false);
    }
  };

  const confirmarDelete = async () => {
    if (deleteId === null) return;
    setIsDeleting(true);
    try {
      await adminService.deletarExercicio(deleteId);
      setExercises((prev) => prev.filter((ex) => ex.id !== deleteId));
      setDeleteId(null);
    } catch {
      setPageError("Erro ao deletar atividade.");
      setDeleteId(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleImageFile = (file: File, onResult: (data: string) => void) => {
    const reader = new FileReader();
    reader.onload = () => onResult(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div>
      {/* Breadcrumb */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors mb-5 group">
        <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
        {trackTitle ? `${trackTitle} / ${moduloTitle}` : moduloTitle}
      </button>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Atividades</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            {exercises.length} {exercises.length === 1 ? "atividade" : "atividades"}
          </p>
        </div>
        <button
          onClick={abrirCriar}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-light)] transition-colors">
          <Plus size={16} /> Nova Atividade
        </button>
      </div>

      {pageError && <p className="mb-4 text-sm text-[var(--color-error-heart)]">{pageError}</p>}

      {/* List */}
      {isLoading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-2xl bg-[var(--color-bg-card)] animate-pulse border border-[var(--color-gray-border)]" />
          ))}
        </div>
      ) : exercises.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-[var(--color-gray-border)] text-[var(--color-text-muted)]">
          <Zap size={40} strokeWidth={1.5} className="mb-3 opacity-40" />
          <p className="text-sm font-medium">Nenhuma atividade ainda</p>
          <p className="text-xs mt-1 opacity-60">Crie a primeira atividade do módulo</p>
          <button
            onClick={abrirCriar}
            className="mt-5 px-4 py-2 rounded-xl text-sm font-semibold bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-light)] transition-colors">
            Nova Atividade
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {exercises.map((ex, idx) => (
            <div
              key={ex.id}
              className="group flex items-center gap-4 px-5 py-4 rounded-2xl border border-[var(--color-gray-border)] bg-[var(--color-bg-card)] hover:border-[var(--color-accent-light)]/50 hover:bg-white/[0.03] transition-all">
              {/* Index */}
              <span className="text-2xl font-bold text-[var(--color-text-muted)]/25 w-8 shrink-0 select-none tabular-nums">
                {String(idx + 1).padStart(2, "0")}
              </span>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[var(--color-text-primary)] truncate">{ex.statement}</p>
                {ex.tags && parseTags(ex.tags).length > 0 && (
                  <div className="flex gap-1.5 mt-1 flex-wrap">
                    {parseTags(ex.tags).map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[var(--color-accent)]/10 text-[var(--color-accent-light)]">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Type badge */}
              <span className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold shrink-0 ${EX_TYPE_COLOR[ex.exerciseType]}`}>
                <Zap size={11} />
                {EX_TYPE_LABEL[ex.exerciseType]}
              </span>

              {/* XP */}
              <span className="hidden sm:block text-xs font-semibold text-yellow-400/80 shrink-0">
                +{ex.xpReward} XP
              </span>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button
                  onClick={(e) => abrirEditar(e, ex)}
                  className="p-2 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-white/10 transition-colors"
                  title="Editar">
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => setDeleteId(ex.id)}
                  className="p-2 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-error-heart)] hover:bg-white/10 transition-colors"
                  title="Deletar">
                  <Trash2 size={14} />
                </button>
              </div>

              <ChevronRight size={16} className="text-[var(--color-text-muted)]/30 shrink-0" />
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl p-6 flex flex-col gap-5 my-auto"
            style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-gray-border)" }}>

            {/* Header with step indicator */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
                  {editingId !== null ? "Editar Atividade" : "Nova Atividade"}
                </h2>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                  Passo {step} de 2 — {step === 1 ? "Configuração geral" : "Dados da atividade"}
                </p>
              </div>
              <div className="flex gap-1.5">
                <div className={`w-8 h-1.5 rounded-full ${step >= 1 ? "bg-[var(--color-accent)]" : "bg-[var(--color-gray-border)]"}`} />
                <div className={`w-8 h-1.5 rounded-full ${step >= 2 ? "bg-[var(--color-accent)]" : "bg-[var(--color-gray-border)]"}`} />
              </div>
            </div>

            {step === 1 ? (
              <form onSubmit={avancarStep1} className="flex flex-col gap-4">
                {/* Tipo */}
                <div>
                  <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5">Tipo de atividade</label>
                  <div className="flex gap-2 flex-wrap">
                    {(Object.keys(EX_TYPE_LABEL) as ExType[]).map((t) => (
                      <button key={t} type="button"
                        onClick={() => setStep1((s) => ({ ...s, exerciseType: t }))}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-colors border ${
                          step1.exerciseType === t
                            ? "bg-[var(--color-accent)] text-white border-transparent"
                            : "bg-transparent text-[var(--color-text-muted)] border-[var(--color-gray-border)] hover:border-[var(--color-text-muted)]"
                        }`}>
                        {EX_TYPE_LABEL[t]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Enunciado */}
                <div>
                  <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5">Enunciado *</label>
                  <textarea
                    className={inputCls + " resize-none"}
                    rows={4}
                    placeholder="O que o aluno deve fazer?"
                    value={step1.statement}
                    onChange={(e) => setStep1((s) => ({ ...s, statement: e.target.value }))}
                    autoFocus
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5">Assuntos relacionados</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {step1.tags.map((tag, i) => (
                      <span key={i} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--color-accent)]/15 text-[var(--color-accent-light)]">
                        {tag}
                        <button type="button" onClick={() => setStep1((s) => ({ ...s, tags: s.tags.filter((_, j) => j !== i) }))}>
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                    <div className="flex items-center gap-1">
                      <input
                        className="px-2.5 py-1 rounded-lg text-xs bg-[var(--color-bg-card-inner)] text-[var(--color-text-primary)] border border-[var(--color-gray-border)] outline-none w-28 focus:border-[var(--color-accent-light)]"
                        placeholder="Tag..."
                        value={step1.tagInput}
                        onChange={(e) => setStep1((s) => ({ ...s, tagInput: e.target.value }))}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const val = step1.tagInput.trim().toUpperCase();
                            if (val) setStep1((s) => ({ ...s, tags: [...s.tags, val], tagInput: "" }));
                          }
                        }}
                      />
                      <button type="button"
                        onClick={() => {
                          const val = step1.tagInput.trim().toUpperCase();
                          if (val) setStep1((s) => ({ ...s, tags: [...s.tags, val], tagInput: "" }));
                        }}
                        className="p-1.5 rounded-lg bg-[var(--color-gray-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-accent)] hover:text-white transition-colors">
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Imagem */}
                <div>
                  <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5">Imagem (opcional)</label>
                  {step1.imageData ? (
                    <div className="flex items-center gap-3">
                      <img src={step1.imageData} alt="Preview" className="w-16 h-16 rounded-xl object-cover" />
                      <button type="button"
                        onClick={() => { setStep1((s) => ({ ...s, imageData: "" })); if (imageRef.current) imageRef.current.value = ""; }}
                        className="flex items-center gap-1 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-error-heart)] transition-colors">
                        <X size={12} /> Remover
                      </button>
                    </div>
                  ) : (
                    <label className="flex items-center gap-2 w-fit px-4 py-2.5 rounded-xl text-sm bg-[var(--color-bg-card-inner)] text-[var(--color-text-secondary)] border border-[var(--color-gray-border)] cursor-pointer hover:border-[var(--color-accent-light)] transition-colors">
                      <Upload size={14} />
                      Selecionar imagem
                      <input ref={imageRef} type="file" accept="image/*" className="hidden"
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageFile(f, (d) => setStep1((s) => ({ ...s, imageData: d }))); }} />
                    </label>
                  )}
                </div>

                {formError && <p className="text-sm text-[var(--color-error-heart)]">{formError}</p>}

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button type="button" onClick={fecharModal}
                    className="px-4 py-2 rounded-xl text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
                    Cancelar
                  </button>
                  <button type="submit"
                    className="px-6 py-2 rounded-xl text-sm font-semibold bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-light)] transition-colors">
                    Próximo →
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={salvar} className="flex flex-col gap-4">
                {/* XP */}
                <div>
                  <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5">Recompensa de XP</label>
                  <div className="flex gap-2">
                    {[3, 5, 7].map((xp) => (
                      <button key={xp} type="button"
                        onClick={() => setStep2((s) => ({ ...s, xpReward: xp }))}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors border ${
                          step2.xpReward === xp
                            ? "bg-yellow-500/15 text-yellow-400 border-yellow-400/30"
                            : "bg-transparent text-[var(--color-text-muted)] border-[var(--color-gray-border)] hover:border-[var(--color-text-muted)]"
                        }`}>
                        ✦ +{xp} XP
                      </button>
                    ))}
                  </div>
                </div>

                {/* Type-specific editor */}
                <div>
                  <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-2">Conteúdo da atividade</label>
                  <p className="text-sm text-[var(--color-text-primary)] mb-3 px-3 py-2 rounded-lg bg-[var(--color-bg-card-inner)] border border-[var(--color-gray-border)]">
                    {step1.statement}
                  </p>

                  {step1.exerciseType === "PAIRS" && (
                    <div className="flex flex-col gap-2">
                      {step2.pairs.map((pair, i) => (
                        <div key={i} className="flex gap-2">
                          <input
                            className="flex-1 rounded-lg px-3 py-2 text-sm bg-[var(--color-bg-card-inner)] text-[var(--color-text-primary)] border border-[var(--color-gray-border)] outline-none focus:border-[var(--color-accent-light)]"
                            placeholder={`Esquerda ${i + 1}`}
                            value={pair.left}
                            onChange={(e) => setStep2((s) => { const p = [...s.pairs]; p[i] = { ...p[i], left: e.target.value }; return { ...s, pairs: p }; })}
                          />
                          <input
                            className="flex-1 rounded-lg px-3 py-2 text-sm bg-[var(--color-bg-card-inner)] text-[var(--color-text-primary)] border border-[var(--color-gray-border)] outline-none focus:border-[var(--color-accent-light)]"
                            placeholder={`Direita ${i + 1}`}
                            value={pair.right}
                            onChange={(e) => setStep2((s) => { const p = [...s.pairs]; p[i] = { ...p[i], right: e.target.value }; return { ...s, pairs: p }; })}
                          />
                          {step2.pairs.length > 2 && (
                            <button type="button"
                              onClick={() => setStep2((s) => ({ ...s, pairs: s.pairs.filter((_, j) => j !== i) }))}
                              className="text-[var(--color-text-muted)] hover:text-[var(--color-error-heart)] transition-colors">
                              <X size={14} />
                            </button>
                          )}
                        </div>
                      ))}
                      <button type="button"
                        onClick={() => setStep2((s) => ({ ...s, pairs: [...s.pairs, { left: "", right: "" }] }))}
                        className="flex items-center gap-1 text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors mt-1">
                        <Plus size={12} /> Adicionar par
                      </button>
                    </div>
                  )}

                  {step1.exerciseType === "DRAG_DROP" && (
                    <div className="flex flex-col gap-2">
                      {step2.dragItems.map((item, i) => (
                        <div key={i} className="flex gap-2">
                          <input
                            className="flex-1 rounded-lg px-3 py-2 text-sm bg-[var(--color-bg-card-inner)] text-[var(--color-text-primary)] border border-[var(--color-gray-border)] outline-none focus:border-[var(--color-accent-light)]"
                            placeholder={`Passo ${i + 1}`}
                            value={item}
                            onChange={(e) => setStep2((s) => { const it = [...s.dragItems]; it[i] = e.target.value; return { ...s, dragItems: it }; })}
                          />
                          {step2.dragItems.length > 2 && (
                            <button type="button"
                              onClick={() => setStep2((s) => ({ ...s, dragItems: s.dragItems.filter((_, j) => j !== i) }))}
                              className="text-[var(--color-text-muted)] hover:text-[var(--color-error-heart)] transition-colors">
                              <X size={14} />
                            </button>
                          )}
                        </div>
                      ))}
                      <button type="button"
                        onClick={() => setStep2((s) => ({ ...s, dragItems: [...s.dragItems, ""] }))}
                        className="flex items-center gap-1 text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors mt-1">
                        <Plus size={12} /> Adicionar passo
                      </button>
                    </div>
                  )}

                  {step1.exerciseType === "MULTIPLE_CHOICE" && (
                    <div>
                      <p className="text-xs text-[var(--color-text-muted)] mb-2">Duplo clique para marcar a alternativa correta</p>
                      <div className="grid grid-cols-2 gap-3">
                        {step2.mcOptions.map((opt, i) => (
                          <div
                            key={i}
                            onDoubleClick={() => setStep2((s) => ({ ...s, mcOptions: s.mcOptions.map((o, j) => ({ ...o, correct: j === i })) }))}
                            className={`rounded-xl p-3 flex flex-col gap-2 cursor-pointer border transition-colors ${
                              opt.correct ? "border-[var(--color-accent)]" : "border-[var(--color-gray-border)]"
                            } bg-[var(--color-bg-card-inner)]`}>
                            {opt.image ? (
                              <div className="relative">
                                <img src={opt.image} alt="" className="w-full h-20 object-cover rounded-lg" />
                                <button type="button"
                                  onClick={(e) => { e.stopPropagation(); setStep2((s) => { const o = [...s.mcOptions]; o[i] = { ...o[i], image: "" }; return { ...s, mcOptions: o }; }); if (mcImageRefs[i].current) mcImageRefs[i].current!.value = ""; }}
                                  className="absolute top-1 right-1 bg-black/50 rounded-full p-0.5 text-white hover:bg-[var(--color-error)] transition-colors">
                                  <X size={10} />
                                </button>
                              </div>
                            ) : (
                              <label className="flex items-center justify-center gap-2 h-20 rounded-lg border border-dashed border-[var(--color-gray-border)] text-xs text-[var(--color-text-muted)] cursor-pointer hover:border-[var(--color-accent-light)] transition-colors">
                                <Upload size={12} /> Imagem
                                <input ref={mcImageRefs[i]} type="file" accept="image/*" className="hidden"
                                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageFile(f, (d) => { setStep2((s) => { const o = [...s.mcOptions]; o[i] = { ...o[i], image: d }; return { ...s, mcOptions: o }; }); }); }} />
                              </label>
                            )}
                            <input
                              className="w-full rounded-lg px-2 py-1.5 text-xs bg-transparent text-[var(--color-text-primary)] border border-[var(--color-gray-border)] outline-none focus:border-[var(--color-accent-light)]"
                              placeholder="Descrição"
                              value={opt.description}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => setStep2((s) => { const o = [...s.mcOptions]; o[i] = { ...o[i], description: e.target.value }; return { ...s, mcOptions: o }; })}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {formError && <p className="text-sm text-[var(--color-error-heart)]">{formError}</p>}

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button type="button" onClick={() => setStep(1)}
                    className="px-4 py-2 rounded-xl text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
                    ← Voltar
                  </button>
                  <button type="submit" disabled={isSaving}
                    className="px-6 py-2 rounded-xl text-sm font-semibold bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-light)] disabled:opacity-60 transition-colors">
                    {isSaving ? "Salvando..." : editingId !== null ? "Salvar" : "Criar"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-sm rounded-2xl p-6 flex flex-col gap-4 my-auto"
            style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-gray-border)" }}>
            <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Excluir atividade?</h2>
            <p className="text-sm text-[var(--color-text-secondary)]">Esta ação não pode ser desfeita.</p>
            <div className="flex items-center justify-end gap-2">
              <button onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-xl text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
                Cancelar
              </button>
              <button onClick={confirmarDelete} disabled={isDeleting}
                className="px-5 py-2 rounded-xl text-sm font-semibold bg-[var(--color-error)] text-white hover:opacity-90 disabled:opacity-60 transition-colors">
                {isDeleting ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
