import { describe, it, expect } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import App from "../components/App";

afterEach(cleanup);

describe("App component", () => {
  it("renders correct heading", () => {
    const { asFragment } = render(<App />);
    expect(asFragment()).toMatchSnapshot();
  });
});

it('tests header', () => {
  const { getByTestId, getByText } = render(<App />)
  expect(getByTestId('this-header')).toHaveTextContent('Mama');
  expect(getByText('Mama')).toBeInTheDocument();
  expect(getByText('Mama')).toHaveClass('fancy');
})