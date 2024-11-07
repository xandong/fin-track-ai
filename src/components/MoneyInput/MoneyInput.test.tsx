import { render, screen } from "@testing-library/react"
import { MoneyInput } from "."

describe("<MoneyInput />", () => {
  it("should render the heading", () => {
    const { container } = render(<MoneyInput />)

    expect(screen.getByRole("heading", { name: /MoneyInput/i })).toBeInTheDocument()

    expect(container.firstChild).toMatchSnapshot()
  })
})
