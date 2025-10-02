"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CreditCard, QrCode, FileText, Check, ArrowLeft, Copy, CheckCheck } from "lucide-react"

type PaymentMethod = "pix" | "card" | "boleto"

export function PaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pix")
  const [step, setStep] = useState<"method" | "details" | "success">("method")
  const [isProcessing, setIsProcessing] = useState(false)
  const [copied, setCopied] = useState(false)
  const [cardErrors, setCardErrors] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  })
  const [cardValues, setCardValues] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  })

  const handleCopyPix = async () => {
    try {
      await navigator.clipboard.writeText("00020126580014br.gov.bcb.pix...")
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Erro ao copiar:", err)
    }
  }

  const validateCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, "")
    if (cleaned.length > 0 && cleaned.length < 16) {
      return "Número do cartão incompleto"
    }
    return ""
  }

  const validateCardName = (value: string) => {
    if (value.length > 0 && value.length < 3) {
      return "Nome muito curto"
    }
    return ""
  }

  const validateExpiry = (value: string) => {
    const cleaned = value.replace(/\//g, "")
    if (cleaned.length > 0 && cleaned.length < 4) {
      return "Data inválida"
    }
    return ""
  }

  const validateCVV = (value: string) => {
    if (value.length > 0 && value.length < 3) {
      return "CVV incompleto"
    }
    return ""
  }

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, "")
    const chunks = cleaned.match(/.{1,4}/g) || []
    return chunks.join(" ").substring(0, 19)
  }

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\//g, "")
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + "/" + cleaned.substring(2, 4)
    }
    return cleaned
  }

  const handleCardInput = (field: keyof typeof cardValues, value: string) => {
    let formattedValue = value
    let error = ""

    switch (field) {
      case "number":
        formattedValue = formatCardNumber(value)
        error = validateCardNumber(formattedValue)
        break
      case "name":
        formattedValue = value.toUpperCase()
        error = validateCardName(value)
        break
      case "expiry":
        formattedValue = formatExpiry(value)
        error = validateExpiry(formattedValue)
        break
      case "cvv":
        formattedValue = value.replace(/\D/g, "").substring(0, 4)
        error = validateCVV(formattedValue)
        break
    }

    setCardValues({ ...cardValues, [field]: formattedValue })
    setCardErrors({ ...cardErrors, [field]: error })
  }

  const handlePayment = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setStep("success")
    }, 1500)
  }

  if (step === "success") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 animate-in fade-in duration-500">
        <Card className="w-full max-w-md p-8 text-center animate-in zoom-in duration-300">
          <div className="mx-auto w-16 h-16 bg-success rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-500 delay-150">
            <Check className="w-8 h-8 text-success-foreground" />
          </div>
          <h1 className="text-2xl font-semibold mb-2 text-balance tracking-tight">Pagamento confirmado!</h1>
          <p className="text-muted-foreground mb-8 font-normal">Seu pagamento foi processado com sucesso.</p>
          <Button onClick={() => setStep("method")} className="w-full font-medium">
            Fazer novo pagamento
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">P</span>
            </div>
            <span className="font-semibold text-lg tracking-tight">PayBank</span>
          </div>
          <Button variant="ghost" size="sm" className="font-medium">
            Ajuda
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === "method" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mb-4 -ml-2 font-medium"
                    onClick={() => window.history.back()}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar
                  </Button>
                  <h1 className="text-3xl font-bold mb-2 text-balance tracking-tight">Como você quer pagar?</h1>
                  <p className="text-muted-foreground font-normal text-base">
                    Escolha a forma de pagamento que preferir
                  </p>
                </div>

                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
                  className="space-y-3"
                >
                  <Card
                    className={`relative transition-all duration-200 ${paymentMethod === "pix" ? "ring-2 ring-success shadow-lg scale-[1.02]" : "hover:shadow-md"}`}
                  >
                    <label
                      htmlFor="pix"
                      className="flex items-center gap-4 p-6 cursor-pointer hover:bg-muted/50 transition-all duration-200 rounded-lg active:scale-[0.98]"
                    >
                      <RadioGroupItem value="pix" id="pix" />
                      <div className="flex items-center gap-4 flex-1">
                        <div
                          className={`w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center transition-transform duration-200 ${paymentMethod === "pix" ? "scale-110" : ""}`}
                        >
                          <QrCode className="w-6 h-6 text-success" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold mb-1 text-base">PIX</div>
                          <div className="text-sm text-muted-foreground font-normal">Aprovação imediata</div>
                        </div>
                        <div className="text-sm font-semibold text-success">Recomendado</div>
                      </div>
                    </label>
                  </Card>

                  <Card
                    className={`relative transition-all duration-200 ${paymentMethod === "card" ? "ring-2 ring-accent shadow-lg scale-[1.02]" : "hover:shadow-md"}`}
                  >
                    <label
                      htmlFor="card"
                      className="flex items-center gap-4 p-6 cursor-pointer hover:bg-muted/50 transition-all duration-200 rounded-lg active:scale-[0.98]"
                    >
                      <RadioGroupItem value="card" id="card" />
                      <div className="flex items-center gap-4 flex-1">
                        <div
                          className={`w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center transition-transform duration-200 ${paymentMethod === "card" ? "scale-110" : ""}`}
                        >
                          <CreditCard className="w-6 h-6 text-accent" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold mb-1 text-base">Cartão de crédito ou débito</div>
                          <div className="text-sm text-muted-foreground font-normal">Parcelamento disponível</div>
                        </div>
                      </div>
                    </label>
                  </Card>

                  <Card
                    className={`relative transition-all duration-200 ${paymentMethod === "boleto" ? "ring-2 ring-primary shadow-lg scale-[1.02]" : "hover:shadow-md"}`}
                  >
                    <label
                      htmlFor="boleto"
                      className="flex items-center gap-4 p-6 cursor-pointer hover:bg-muted/50 transition-all duration-200 rounded-lg active:scale-[0.98]"
                    >
                      <RadioGroupItem value="boleto" id="boleto" />
                      <div className="flex items-center gap-4 flex-1">
                        <div
                          className={`w-12 h-12 bg-muted rounded-lg flex items-center justify-center transition-transform duration-200 ${paymentMethod === "boleto" ? "scale-110" : ""}`}
                        >
                          <FileText className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold mb-1 text-base">Boleto bancário</div>
                          <div className="text-sm text-muted-foreground font-normal">Vencimento em 3 dias úteis</div>
                        </div>
                      </div>
                    </label>
                  </Card>
                </RadioGroup>

                <Button
                  onClick={() => setStep("details")}
                  size="lg"
                  className="w-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] font-semibold"
                >
                  Continuar
                </Button>
              </div>
            )}

            {step === "details" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mb-4 -ml-2 font-medium"
                    onClick={() => setStep("method")}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar
                  </Button>
                  <h1 className="text-3xl font-bold mb-2 text-balance tracking-tight">
                    {paymentMethod === "pix" && "Pagar com PIX"}
                    {paymentMethod === "card" && "Dados do cartão"}
                    {paymentMethod === "boleto" && "Gerar boleto"}
                  </h1>
                  <p className="text-muted-foreground font-normal text-base">
                    {paymentMethod === "pix" && "Escaneie o QR Code ou copie o código PIX"}
                    {paymentMethod === "card" && "Preencha os dados do seu cartão"}
                    {paymentMethod === "boleto" && "Confirme para gerar seu boleto"}
                  </p>
                </div>

                {paymentMethod === "pix" && (
                  <Card className="p-8">
                    <div className="flex flex-col items-center">
                      <div className="w-64 h-64 bg-muted rounded-lg flex items-center justify-center mb-6 animate-pulse">
                        <QrCode className="w-32 h-32 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-4 text-center font-normal">
                        Escaneie o QR Code com o app do seu banco
                      </p>
                      <div className="w-full">
                        <Label htmlFor="pix-code" className="font-medium">
                          Ou copie o código PIX
                        </Label>
                        <div className="flex gap-2 mt-2">
                          <Input
                            id="pix-code"
                            value="00020126580014br.gov.bcb.pix..."
                            readOnly
                            className="font-mono text-sm"
                          />
                          <Button
                            variant="outline"
                            onClick={handleCopyPix}
                            className={`transition-all duration-200 font-medium ${copied ? "bg-success text-success-foreground" : ""}`}
                          >
                            {copied ? (
                              <>
                                <CheckCheck className="w-4 h-4 mr-2" />
                                Copiado!
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4 mr-2" />
                                Copiar
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                {paymentMethod === "card" && (
                  <Card className="p-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="card-number" className="font-medium">
                          Número do cartão
                        </Label>
                        <Input
                          id="card-number"
                          placeholder="0000 0000 0000 0000"
                          className={`mt-2 transition-all duration-200 ${cardErrors.number ? "border-destructive focus-visible:ring-destructive" : "focus-visible:ring-2"}`}
                          value={cardValues.number}
                          onChange={(e) => handleCardInput("number", e.target.value)}
                          maxLength={19}
                        />
                        {cardErrors.number && (
                          <p className="text-xs text-destructive mt-1 animate-in fade-in slide-in-from-top-1 duration-200 font-medium">
                            {cardErrors.number}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="card-name" className="font-medium">
                          Nome no cartão
                        </Label>
                        <Input
                          id="card-name"
                          placeholder="Como está impresso no cartão"
                          className={`mt-2 transition-all duration-200 ${cardErrors.name ? "border-destructive focus-visible:ring-destructive" : "focus-visible:ring-2"}`}
                          value={cardValues.name}
                          onChange={(e) => handleCardInput("name", e.target.value)}
                        />
                        {cardErrors.name && (
                          <p className="text-xs text-destructive mt-1 animate-in fade-in slide-in-from-top-1 duration-200 font-medium">
                            {cardErrors.name}
                          </p>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="card-expiry" className="font-medium">
                            Validade
                          </Label>
                          <Input
                            id="card-expiry"
                            placeholder="MM/AA"
                            className={`mt-2 transition-all duration-200 ${cardErrors.expiry ? "border-destructive focus-visible:ring-destructive" : "focus-visible:ring-2"}`}
                            value={cardValues.expiry}
                            onChange={(e) => handleCardInput("expiry", e.target.value)}
                            maxLength={5}
                          />
                          {cardErrors.expiry && (
                            <p className="text-xs text-destructive mt-1 animate-in fade-in slide-in-from-top-1 duration-200 font-medium">
                              {cardErrors.expiry}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="card-cvv" className="font-medium">
                            CVV
                          </Label>
                          <Input
                            id="card-cvv"
                            placeholder="000"
                            type="password"
                            maxLength={4}
                            className={`mt-2 transition-all duration-200 ${cardErrors.cvv ? "border-destructive focus-visible:ring-destructive" : "focus-visible:ring-2"}`}
                            value={cardValues.cvv}
                            onChange={(e) => handleCardInput("cvv", e.target.value)}
                          />
                          {cardErrors.cvv && (
                            <p className="text-xs text-destructive mt-1 animate-in fade-in slide-in-from-top-1 duration-200 font-medium">
                              {cardErrors.cvv}
                            </p>
                          )}
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="installments" className="font-medium">
                          Parcelas
                        </Label>
                        <select
                          id="installments"
                          className="w-full mt-2 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm transition-all duration-200 focus:ring-2 focus:ring-ring focus:outline-none font-normal"
                        >
                          <option>1x de R$ 250,00 sem juros</option>
                          <option>2x de R$ 125,00 sem juros</option>
                          <option>3x de R$ 83,33 sem juros</option>
                        </select>
                      </div>
                    </div>
                  </Card>
                )}

                {paymentMethod === "boleto" && (
                  <Card className="p-8">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mb-4">
                        <FileText className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <h3 className="font-semibold mb-2 text-lg">Boleto bancário</h3>
                      <p className="text-sm text-muted-foreground mb-6 font-normal">
                        Após a confirmação, você poderá visualizar e imprimir o boleto. O prazo de compensação é de até
                        3 dias úteis.
                      </p>
                      <div className="w-full bg-muted/50 rounded-lg p-4 text-left">
                        <div className="text-sm space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground font-normal">Vencimento:</span>
                            <span className="font-semibold">15/02/2025</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground font-normal">Valor:</span>
                            <span className="font-semibold">R$ 250,00</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                <Button
                  onClick={handlePayment}
                  size="lg"
                  className="w-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] font-semibold"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                      Processando...
                    </>
                  ) : (
                    <>
                      {paymentMethod === "pix" && "Confirmar pagamento"}
                      {paymentMethod === "card" && "Pagar R$ 250,00"}
                      {paymentMethod === "boleto" && "Gerar boleto"}
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-8 animate-in fade-in slide-in-from-top-4 duration-500 delay-150">
              <h2 className="font-semibold text-lg mb-6 tracking-tight">Resumo do pedido</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-muted rounded-lg" />
                  <div className="flex-1">
                    <div className="font-semibold mb-1 text-base">Produto Premium</div>
                    <div className="text-sm text-muted-foreground font-normal">Assinatura mensal</div>
                  </div>
                </div>

                <div className="border-t border-border pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-normal">Subtotal</span>
                    <span className="font-medium">R$ 250,00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-normal">Desconto</span>
                    <span className="text-success font-medium">-R$ 0,00</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>R$ 250,00</span>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
                  <p className="text-balance font-normal">
                    Ao confirmar o pagamento, você concorda com nossos{" "}
                    <a href="#" className="text-foreground underline hover:text-primary transition-colors font-medium">
                      termos de uso
                    </a>
                    .
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
