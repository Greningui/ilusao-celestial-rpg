import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-primary/20 bg-card/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="font-display text-xl font-bold text-primary gold-glow">Política de Privacidade</h1>
        </div>
      </header>

      <main className="flex-1 px-4 py-8">
        <div className="max-w-4xl mx-auto prose prose-invert">
          <div className="space-y-6 text-foreground">
            <section>
              <h2 className="text-2xl font-bold mb-4">Política de Privacidade - Ilusão Celestial RPG</h2>
              <p className="text-muted-foreground">Última atualização: 11 de Março de 2026</p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">1. Introdução</h3>
              <p>
                A Ilusão Celestial RPG ("nós", "nosso" ou "nos") opera o site/aplicação Ilusão Celestial RPG. Esta página informa você sobre nossas políticas
                relativas à coleta, uso e divulgação de dados pessoais quando você usa nosso serviço e as escolhas que você tem associadas a esses dados.
              </p>
              <p>
                Estamos comprometidos com a conformidade com a Lei Geral de Proteção de Dados (LGPD) e o Regulamento Geral sobre a Proteção de Dados (GDPR).
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">2. Dados que Coletamos</h3>
              <p>Coletamos os seguintes tipos de dados pessoais:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Nome completo</li>
                <li>Endereço de email</li>
                <li>Número de telefone/WhatsApp</li>
                <li>Foto de perfil (opcional)</li>
                <li>Endereço IP</li>
                <li>Informações do dispositivo (User Agent, tipo de navegador)</li>
                <li>Dados de atividade (logins, ações realizadas)</li>
                <li>Localização aproximada (baseada em IP)</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">3. Como Usamos Seus Dados</h3>
              <p>Usamos seus dados para:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Fornecer e melhorar nossos serviços</li>
                <li>Autenticar sua identidade e gerenciar sua conta</li>
                <li>Enviar notificações e atualizações</li>
                <li>Detectar e prevenir fraudes e atividades maliciosas</li>
                <li>Cumprir obrigações legais</li>
                <li>Análise e pesquisa para melhorar a experiência do usuário</li>
                <li>Comunicação com você sobre mudanças em nossos serviços</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">4. Base Legal para Processamento</h3>
              <p>Processamos seus dados com base em:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Seu consentimento explícito</li>
                <li>Execução de contrato (prestação de serviços)</li>
                <li>Conformidade com obrigações legais</li>
                <li>Proteção de interesses legítimos</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">5. Segurança de Dados</h3>
              <p>Implementamos medidas de segurança rigorosas:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Criptografia de dados em trânsito (HTTPS/TLS)</li>
                <li>Criptografia de dados em repouso</li>
                <li>Autenticação de dois fatores (2FA)</li>
                <li>Controle de acesso baseado em papéis</li>
                <li>Auditoria de segurança regular</li>
                <li>Backup automático e plano de recuperação de desastres</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">6. Retenção de Dados</h3>
              <p>Retemos seus dados pelo tempo necessário para:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Fornecer nossos serviços</li>
                <li>Cumprir obrigações legais (mínimo 5 anos)</li>
                <li>Resolver disputas</li>
                <li>Logs de auditoria: 90 dias</li>
                <li>Backups: 30 dias</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">7. Seus Direitos (LGPD/GDPR)</h3>
              <p>Você tem o direito de:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Acessar:</strong> Solicitar uma cópia de seus dados pessoais</li>
                <li><strong>Retificar:</strong> Corrigir dados imprecisos</li>
                <li><strong>Apagar:</strong> Solicitar a exclusão de seus dados (direito ao esquecimento)</li>
                <li><strong>Restringir:</strong> Limitar o processamento de seus dados</li>
                <li><strong>Portabilidade:</strong> Receber seus dados em formato estruturado</li>
                <li><strong>Objeção:</strong> Opor-se ao processamento de seus dados</li>
                <li><strong>Revogar Consentimento:</strong> Retirar consentimento a qualquer momento</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">8. Compartilhamento de Dados</h3>
              <p>
                Não compartilhamos seus dados pessoais com terceiros, exceto:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Quando exigido por lei</li>
                <li>Para proteger nossos direitos e segurança</li>
                <li>Com seu consentimento explícito</li>
                <li>Processadores de dados (Supabase, provedores de email)</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">9. Cookies</h3>
              <p>
                Usamos cookies para:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Manter você conectado</li>
                <li>Lembrar preferências</li>
                <li>Análise de uso (com consentimento)</li>
              </ul>
              <p>Você pode desabilitar cookies em seu navegador, mas isso pode afetar a funcionalidade.</p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">10. Contato</h3>
              <p>
                Para exercer seus direitos ou fazer perguntas sobre esta política, entre em contato:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Email: privacy@ilusaocelestial.com</li>
                <li>Formulário de contato: [Link]</li>
                <li>Endereço: [Seu endereço]</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">11. Mudanças nesta Política</h3>
              <p>
                Podemos atualizar esta política de privacidade periodicamente. Notificaremos você sobre mudanças significativas por email ou através de um aviso destacado em nosso site.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">12. Conformidade com LGPD</h3>
              <p>
                Como empresa que processa dados de residentes brasileiros, estamos em conformidade total com a Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018).
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Designamos um Encarregado de Proteção de Dados (DPO)</li>
                <li>Realizamos Avaliações de Impacto à Proteção de Dados (AIPD)</li>
                <li>Mantemos registros de atividades de processamento</li>
                <li>Implementamos Privacidade por Design</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
