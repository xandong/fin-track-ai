import { Meta, StoryObj } from "@storybook/react"
import { MoneyInput } from "."

const meta: Meta = {
  title: 'MoneyInput',
  component: MoneyInput
}

export default meta

type Story = StoryObj<typeof MoneyInput>

export const Default: Story = {}
