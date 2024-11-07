import { Meta, StoryObj } from "@storybook/react"
import { AddTransaction } from "."

const meta: Meta = {
  title: 'AddTransaction',
  component: AddTransaction
}

export default meta

type Story = StoryObj<typeof AddTransaction>

export const Default: Story = {}
