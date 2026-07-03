import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import type { SVGProps, ReactElement } from "react";
import Book from "./Book";
import BookOne from "./BookOne";
import Calendar from "./Calendar";
import Cancel from "./Cancel";
import CircleX from "./CircleX";
import Crown from "./Crown";
import FireOff from "./FireOff";
import FireOn from "./FireOn";
import Home from "./Home";
import Lightning from "./Lightning";
import LogOut from "./LogOut";
import Notification from "./Notification";
import Pin from "./Pin";
import Settings from "./Settings";
import Stopwatch from "./Stopwatch";
import User from "./User";
import Xp from "./Xp";

const icons: Array<{ name: string; Icon: (props: SVGProps<SVGSVGElement>) => ReactElement }> = [
  { name: "Book", Icon: Book },
  { name: "BookOne", Icon: BookOne },
  { name: "Calendar", Icon: Calendar },
  { name: "Cancel", Icon: Cancel },
  { name: "CircleX", Icon: CircleX },
  { name: "Crown", Icon: Crown },
  { name: "FireOff", Icon: FireOff },
  { name: "FireOn", Icon: FireOn },
  { name: "Home", Icon: Home },
  { name: "Lightning", Icon: Lightning },
  { name: "LogOut", Icon: LogOut },
  { name: "Notification", Icon: Notification },
  { name: "Pin", Icon: Pin },
  { name: "Settings", Icon: Settings },
  { name: "Stopwatch", Icon: Stopwatch },
  { name: "User", Icon: User },
  { name: "Xp", Icon: Xp },
];

describe("icons", () => {
  it.each(icons)("$name renderiza svg", ({ Icon }) => {
    const { container } = render(<Icon data-testid="icon" />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});
