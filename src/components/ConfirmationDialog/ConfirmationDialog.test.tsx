import { render, screen } from "@testing-library/react"
import { ConfirmationDialog } from "."

describe("<ConfirmationDialog />", () => {
  it("should render the heading", () => {
    const { container } = render(
      <ConfirmationDialog handleConfirm={() => {}} />
    )

    expect(
      screen.getByRole("heading", { name: /ConfirmationDialog/i })
    ).toBeInTheDocument()

    expect(container.firstChild).toMatchSnapshot()
  })
})
