"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy, Key, Lock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function JWTSecretGenerator() {
  const [inputValue, setInputValue] = useState("")
  const [jwtSecret, setJwtSecret] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  // Convert Node.js crypto code to browser-compatible Web Crypto API
  const generateJWTSecret = async () => {
    if (!inputValue.trim()) {
      toast({
        title: "Error",
        description: "Please enter a payload secret",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      // Convert string to Uint8Array
      const encoder = new TextEncoder()
      const data = encoder.encode(inputValue)

      // Create SHA-256 hash using Web Crypto API
      const hashBuffer = await crypto.subtle.digest("SHA-256", data)

      // Convert ArrayBuffer to hex string
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")

      // Get first 32 characters (equivalent to .slice(0, 32))
      const secret = hashHex.slice(0, 32)

      setJwtSecret(secret)
      console.log("Your JWT secret is:", secret)

      toast({
        title: "Success",
        description: "JWT secret generated successfully!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate JWT secret",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async () => {
    if (!jwtSecret) return

    try {
      await navigator.clipboard.writeText(jwtSecret)
      toast({
        title: "Copied!",
        description: "JWT secret copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      })
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      generateJWTSecret()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="p-3 bg-blue-600 rounded-full">
              <Key className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">PayloadCMS JWT Secret Generator</h1>
          <p className="text-gray-600">Using your Payload secret, generate the JWT signing secret used by your PayloadCMS backend</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Generate Secret
            </CardTitle>
            <CardDescription>Enter your payload secret from the environment variable payload-secret</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="payload">Payload Secret</Label>
              <Input
                id="payload"
                type="text"
                placeholder="Enter your payload secret..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="font-mono"
              />
            </div>

            <Button onClick={generateJWTSecret} disabled={isGenerating || !inputValue.trim()} className="w-full">
              {isGenerating ? "Generating..." : "Generate JWT Secret"}
            </Button>

            {jwtSecret && (
              <div className="space-y-2">
                <Label htmlFor="secret">Generated JWT Secret</Label>
                <div className="relative">
                  <Input
                    id="secret"
                    type="text"
                    value={jwtSecret}
                    readOnly
                    className="font-mono text-sm pr-10 bg-gray-50"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1 h-8 w-8"
                    onClick={copyToClipboard}
                  >
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copy to clipboard</span>
                  </Button>
                </div>
                <p className="text-xs text-gray-500">This is the 32-character JWT signing secret used by your PayloadCMS backend to sign the JWT tokens. Keep it secure!</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center text-sm text-gray-500">
          <p>Algorithm: SHA-256 hash truncated to 32 characters</p>
          <p className="mt-1">Browser-compatible • No server required</p>
        </div>
      </div>
    </div>
  )
}
