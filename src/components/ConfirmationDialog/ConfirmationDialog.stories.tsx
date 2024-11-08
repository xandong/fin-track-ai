import { Meta, StoryObj } from "@storybook/react"
import { ConfirmationDialog } from "."

const meta: Meta = {
  title: 'ConfirmationDialog',
  component: ConfirmationDialog
}

export default meta

type Story = StoryObj<typeof ConfirmationDialog>

export const Default: Story = {}
