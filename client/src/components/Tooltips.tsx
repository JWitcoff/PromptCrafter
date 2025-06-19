"use client"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Info } from "lucide-react"

export const SystemPromptTooltip = () => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Info className="w-4 h-4 text-slate-500 cursor-help hover:text-slate-700" />
    </TooltipTrigger>
    <TooltipContent className="max-w-sm text-sm">
      <p className="font-medium text-slate-900 mb-1">System Prompt</p>
      <p>
        Tells the AI how to behave. It's like setting the "vibe" or rules before the conversation starts.
      </p>
      <p className="mt-1 text-slate-600">
        Use this only if you're building with the OpenAI API, GPTs, or ChatGPT's Custom Instructions.
      </p>
    </TooltipContent>
  </Tooltip>
)

export const UserPromptTooltip = () => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Info className="w-4 h-4 text-slate-500 cursor-help hover:text-slate-700" />
    </TooltipTrigger>
    <TooltipContent className="max-w-sm text-sm">
      <p className="font-medium text-slate-900 mb-1">User Prompt</p>
      <p>
        This is the actual message you send to ChatGPT or any assistant to get the response you want.
      </p>
      <p className="mt-1 text-slate-600">
        Just copy/paste and edit for your use case. This is what most users will need.
      </p>
    </TooltipContent>
  </Tooltip>
)

export const FieldSelectorHoverCard = () => (
  <HoverCard>
    <HoverCardTrigger asChild>
      <Info className="w-4 h-4 text-slate-500 cursor-help hover:text-slate-700" />
    </HoverCardTrigger>
    <HoverCardContent className="w-72 text-sm">
      <p className="font-medium mb-1 text-slate-900">What are these for?</p>
      <ul className="list-disc ml-4 text-slate-700">
        <li><strong>Model</strong>: Choose the type of AI (e.g. GPT‑4o, 3.5, Turbo).</li>
        <li><strong>Task</strong>: What you want the AI to do (summarize, write code, etc).</li>
        <li><strong>Tone</strong>: How you want it to sound (friendly, formal, technical).</li>
      </ul>
    </HoverCardContent>
  </HoverCard>
)