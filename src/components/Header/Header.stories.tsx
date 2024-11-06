import { Meta, StoryObj } from "@storybook/react"
import { Header } from "."

const meta: Meta = {
  title: "Header",
  component: Header
}

export default meta

type Story = StoryObj<typeof Header>

export const Default: Story = {}
