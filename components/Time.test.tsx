import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Time from "./Time";

describe("Time", () => {
  it("should render formatted date", () => {
    render(<Time dateTime="2024-01-15T10:30:00Z" />);

    const timeElement = screen.getByText("2024-01-15");
    expect(timeElement).toBeInTheDocument();
  });

  it("should have time element with datetime attribute", () => {
    render(<Time dateTime="2024-01-15T10:30:00Z" />);

    const timeElement = screen.getByText("2024-01-15");
    expect(timeElement.tagName).toBe("TIME");
    expect(timeElement).toHaveAttribute("datetime", "2024-01-15T10:30:00Z");
  });

  it("should have title attribute with full datetime", () => {
    render(<Time dateTime="2024-01-15T10:30:00Z" />);

    const timeElement = screen.getByText("2024-01-15");
    expect(timeElement).toHaveAttribute("title", "2024-01-15T10:30:00Z");
  });

  it("should apply correct CSS classes", () => {
    render(<Time dateTime="2024-01-15T10:30:00Z" />);

    const timeElement = screen.getByText("2024-01-15");
    expect(timeElement).toHaveClass("block");
    expect(timeElement).toHaveClass("text-[.8rem]");
    expect(timeElement).toHaveClass("text-gray-500");
    expect(timeElement).toHaveClass("dark:text-gray-400");
  });
});
