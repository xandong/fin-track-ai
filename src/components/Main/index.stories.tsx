import { Meta, StoryObj } from "@storybook/react"
import Main from "."

const meta: Meta = {
  title: "Main",
  component: Main,
  parameters: {
    layout: "fullscreen"
  }
} as Meta

export default meta

type Story = StoryObj<typeof Main>

export const Default: Story = {}
