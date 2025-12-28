import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Time from "./Time";

describe("Time", () => {
  it("should render formatted date", () => {
    render(<Time dateTime="2024-01-15T10:30:00Z" />);

    const timeElement = screen.getByText("Jan 15, 2024");
    expect(timeElement).toBeInTheDocument();
  });

  it("should have time element with datetime attribute", () => {
    render(<Time dateTime="2024-01-15T10:30:00Z" />);

    const timeElement = screen.getByText("Jan 15, 2024");
    expect(timeElement.tagName).toBe("TIME");
    expect(timeElement).toHaveAttribute("datetime", "2024-01-15T10:30:00Z");
  });

  it("should have title attribute with full datetime", () => {
    render(<Time dateTime="2024-01-15T10:30:00Z" />);

    const timeElement = screen.getByText("Jan 15, 2024");
    expect(timeElement).toHaveAttribute("title", "2024-01-15T10:30:00Z");
  });

  it("should apply correct CSS classes", () => {
    render(<Time dateTime="2024-01-15T10:30:00Z" />);

    const timeElement = screen.getByText("Jan 15, 2024");
    expect(timeElement).toHaveClass("inline-flex");
    expect(timeElement).toHaveClass("items-center");
    expect(timeElement).toHaveClass("text-sm");
    expect(timeElement).toHaveClass("text-gray-600");
    expect(timeElement).toHaveClass("dark:text-gray-400");
    expect(timeElement).toHaveClass("font-medium");
  });
});
