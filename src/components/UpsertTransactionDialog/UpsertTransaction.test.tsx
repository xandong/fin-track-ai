import { render, screen } from "@testing-library/react"
import { UpsertTransactionDialog } from "."

describe("<UpsertTransactionDialog />", () => {
  it("should render the heading", () => {
    const { container } = render(<UpsertTransactionDialog categories={[]} />)

    expect(
      screen.getByRole("heading", { name: /UpsertTransactionDialog/i })
    ).toBeInTheDocument()

    expect(container.firstChild).toMatchSnapshot()
  })
})
