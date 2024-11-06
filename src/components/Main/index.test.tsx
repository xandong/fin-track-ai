import { render, screen } from "@testing-library/react"

import Main from "."

describe("<Main />", () => {
  it("should render the element", () => {
    // renderiza o component
    const { container } = render(<Main />)

    // busca o elemento e verifica se da match
    expect(
      screen.getByRole("heading", {
        name: /main component/i
      })
    ).toBeInTheDocument()

    // gera snapshot
    expect(container.firstChild).toMatchSnapshot()
  })
})
