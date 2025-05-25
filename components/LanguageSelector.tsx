"use client"

import * as React from "react"
import { Globe } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export function LanguageSelector() {
  const [language, setLanguage] = React.useState("中文")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="!rounded-button whitespace-nowrap">
          <Globe className="w-4 h-4 mr-2" />
          {language}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLanguage("中文")}>
          中文
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("English")}>
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("日本語")}>
          日本語
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 