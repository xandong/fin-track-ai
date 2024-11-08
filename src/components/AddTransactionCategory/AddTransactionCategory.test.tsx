import { render, screen } from "@testing-library/react"
import { AddTransactionCategory } from "."

describe("<AddTransactionCategory />", () => {
  it("should render the heading", () => {
    const { container } = render(<AddTransactionCategory />)

    expect(screen.getByRole("heading", { name: /AddTransactionCategory/i })).toBeInTheDocument()

    expect(container.firstChild).toMatchSnapshot()
  })
})
