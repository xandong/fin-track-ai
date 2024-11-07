import { render, screen } from "@testing-library/react"
import { AddTransaction } from "."

describe("<AddTransaction />", () => {
  it("should render the heading", () => {
    const { container } = render(<AddTransaction />)

    expect(screen.getByRole("heading", { name: /AddTransaction/i })).toBeInTheDocument()

    expect(container.firstChild).toMatchSnapshot()
  })
})
