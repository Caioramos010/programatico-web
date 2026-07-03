import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import NotificationCard from "./NotificationCard";

describe("NotificationCard", () => {
  it("renderiza título, mensagem e tempo", () => {
    render(
      <NotificationCard
        item={{
          id: "1",
          title: "Missão concluída",
          message: "Você ganhou XP",
          time: "há 5 minutos",
          kind: "missao",
          read: false,
        }}
        onMarkAsRead={vi.fn()}
      />,
    );

    expect(screen.getByText("Missão concluída")).toBeInTheDocument();
    expect(screen.getByText("Você ganhou XP")).toBeInTheDocument();
    expect(screen.getByText("há 5 minutos")).toBeInTheDocument();
  });

  it("chama onMarkAsRead ao clicar no botão", () => {
    const onMarkAsRead = vi.fn();

    render(
      <NotificationCard
        item={{
          id: "42",
          title: "Nova trilha",
          message: "Conteúdo liberado",
          time: "há 1 hora",
          kind: "trilha",
          read: false,
        }}
        onMarkAsRead={onMarkAsRead}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /marcar como lida/i }));
    expect(onMarkAsRead).toHaveBeenCalledWith("42");
  });

  it("desabilita botão quando notificação já foi lida", () => {
    render(
      <NotificationCard
        item={{
          id: "2",
          title: "Exercício",
          message: "Concluído",
          time: "há 2 dias",
          kind: "exercicio",
          read: true,
        }}
        onMarkAsRead={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: /lida/i })).toBeDisabled();
  });
});
