import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Loader2, Copy, Check, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { use2FA, useEnable2FA, useVerify2FACode, useBackupCodes } from '@/hooks/use2FA';

export default function Setup2FAPage() {
  const { user, loading } = useAuth();
  const { data: twoFA } = use2FA(user?.id);
  const { data: backupCodes = [] } = useBackupCodes(user?.id);
  const enable2FA = useEnable2FA();
  const verify2FACode = useVerify2FACode();
  const { toast } = useToast();

  const [step, setStep] = useState<'method' | 'setup' | 'verify' | 'backup'>('method');
  const [method, setMethod] = useState<'sms' | 'email' | 'authenticator'>('sms');
  const [code, setCode] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  const handleSelectMethod = async (selectedMethod: 'sms' | 'email' | 'authenticator') => {
    setMethod(selectedMethod);
    try {
      await enable2FA.mutateAsync({
        userId: user.id,
        method: selectedMethod,
      });
      setStep('setup');
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' });
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) {
      toast({ title: 'Erro', description: 'Digite o código', variant: 'destructive' });
      return;
    }

    try {
      await verify2FACode.mutateAsync({
        userId: user.id,
        code,
      });
      setStep('backup');
      toast({ title: 'Sucesso', description: '2FA ativado com sucesso!' });
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  if (twoFA?.enabled) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="border-b border-primary/20 bg-card/50 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
            <Link to="/profile">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="font-display text-xl font-bold text-primary gold-glow">Autenticação de Dois Fatores</h1>
          </div>
        </header>

        <main className="flex-1 px-4 py-6">
          <div className="max-w-md mx-auto">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle>2FA Ativado</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Autenticação de dois fatores ativada</p>
                    <p className="text-xs text-muted-foreground">Método: {method}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">Códigos de Backup</Label>
                  <div className="space-y-2 mt-2">
                    {backupCodes.map((code: string, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 bg-secondary/50 rounded text-sm font-mono"
                      >
                        <span>{code}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(code)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Guarde esses códigos em um local seguro. Você pode usá-los para acessar sua conta se perder acesso ao seu dispositivo.
                  </p>
                </div>

                <Link to="/profile">
                  <Button className="w-full">Voltar ao Perfil</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-primary/20 bg-card/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link to="/profile">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="font-display text-xl font-bold text-primary gold-glow">Configurar 2FA</h1>
        </div>
      </header>

      <main className="flex-1 px-4 py-6">
        <div className="max-w-md mx-auto">
          {step === 'method' && (
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle>Escolha o Método</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <button
                  onClick={() => handleSelectMethod('sms')}
                  disabled={enable2FA.isPending}
                  className="w-full p-4 border border-primary/20 rounded-lg hover:bg-primary/5 transition-colors text-left"
                >
                  <p className="font-medium">SMS/WhatsApp</p>
                  <p className="text-sm text-muted-foreground">Receba código por SMS</p>
                </button>

                <button
                  onClick={() => handleSelectMethod('email')}
                  disabled={enable2FA.isPending}
                  className="w-full p-4 border border-primary/20 rounded-lg hover:bg-primary/5 transition-colors text-left"
                >
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">Receba código por email</p>
                </button>

                <button
                  onClick={() => handleSelectMethod('authenticator')}
                  disabled={enable2FA.isPending}
                  className="w-full p-4 border border-primary/20 rounded-lg hover:bg-primary/5 transition-colors text-left"
                >
                  <p className="font-medium">Authenticator App</p>
                  <p className="text-sm text-muted-foreground">Use Google Authenticator</p>
                </button>
              </CardContent>
            </Card>
          )}

          {step === 'setup' && (
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle>Configurar {method === 'sms' ? 'SMS' : method === 'email' ? 'Email' : 'Authenticator'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg flex gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0" />
                  <p className="text-sm">
                    {method === 'sms' && 'Enviaremos um código para seu WhatsApp'}
                    {method === 'email' && 'Enviaremos um código para seu email'}
                    {method === 'authenticator' && 'Escaneie o código QR com seu app'}
                  </p>
                </div>

                <form onSubmit={handleVerifyCode} className="space-y-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Código de Verificação</Label>
                    <Input
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="000000"
                      maxLength={6}
                      className="border-primary/20"
                    />
                  </div>

                  <Button type="submit" disabled={verify2FACode.isPending} className="w-full">
                    {verify2FACode.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    Verificar
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {step === 'backup' && (
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle>Códigos de Backup</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                  <p className="text-sm">
                    Guarde esses códigos em um local seguro. Você pode usá-los para acessar sua conta se perder acesso ao seu dispositivo.
                  </p>
                </div>

                <div className="space-y-2">
                  {backupCodes.map((code: string, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 bg-secondary/50 rounded text-sm font-mono"
                    >
                      <span>{code}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(code)}
                      >
                        {copiedCode ? (
                          <Check className="h-3 w-3 text-green-500" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>

                <Link to="/profile">
                  <Button className="w-full">Concluído</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
