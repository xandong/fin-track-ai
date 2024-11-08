import { Meta, StoryObj } from "@storybook/react"
import { AddTransactionCategory } from "."

const meta: Meta = {
  title: 'AddTransactionCategory',
  component: AddTransactionCategory
}

export default meta

type Story = StoryObj<typeof AddTransactionCategory>

export const Default: Story = {}
