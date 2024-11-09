import { Meta, StoryObj } from "@storybook/react"
import { Navbar } from "."

const meta: Meta = {
  title: 'Navbar',
  component: Navbar
}

export default meta

type Story = StoryObj<typeof Navbar>

export const Default: Story = {}
