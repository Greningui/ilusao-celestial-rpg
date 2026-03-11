import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-primary/20 bg-card/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="font-display text-xl font-bold text-primary gold-glow">Termos de Serviço</h1>
        </div>
      </header>

      <main className="flex-1 px-4 py-8">
        <div className="max-w-4xl mx-auto prose prose-invert">
          <div className="space-y-6 text-foreground">
            <section>
              <h2 className="text-2xl font-bold mb-4">Termos de Serviço - Ilusão Celestial RPG</h2>
              <p className="text-muted-foreground">Última atualização: 11 de Março de 2026</p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">1. Aceitação dos Termos</h3>
              <p>
                Ao acessar e usar o Ilusão Celestial RPG, você concorda em estar vinculado por estes Termos de Serviço. Se você não concorda com qualquer parte destes termos, não use nosso serviço.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">2. Descrição do Serviço</h3>
              <p>
                Ilusão Celestial RPG é uma plataforma de gerenciamento de fichas de RPG que permite aos usuários criar, gerenciar e compartilhar fichas de personagens, participar de campanhas e acessar conteúdo relacionado a RPG.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">3. Conta de Usuário</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Você é responsável por manter a confidencialidade de sua senha</li>
                <li>Você é responsável por todas as atividades em sua conta</li>
                <li>Você concorda em fornecer informações precisas e completas</li>
                <li>Você concorda em atualizar suas informações conforme necessário</li>
                <li>Você não pode transferir sua conta para outra pessoa</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">4. Uso Aceitável</h3>
              <p>Você concorda em não:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Violar qualquer lei ou regulamento aplicável</li>
                <li>Infringir direitos de propriedade intelectual</li>
                <li>Enviar conteúdo ofensivo, discriminatório ou ilegal</li>
                <li>Tentar ganhar acesso não autorizado ao sistema</li>
                <li>Interferir com o funcionamento do serviço</li>
                <li>Usar bots ou scripts automatizados</li>
                <li>Vender ou transferir sua conta</li>
                <li>Coletar dados de outros usuários sem consentimento</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">5. Conteúdo do Usuário</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Você retém todos os direitos sobre o conteúdo que cria</li>
                <li>Você concede a nós uma licença para usar seu conteúdo para operar o serviço</li>
                <li>Você garante que possui direitos para compartilhar o conteúdo</li>
                <li>Podemos remover conteúdo que viole estes termos</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">6. Propriedade Intelectual</h3>
              <p>
                Todo o conteúdo do Ilusão Celestial RPG, incluindo texto, gráficos, logos e software, é propriedade nossa ou de nossos licenciadores e é protegido por leis de direitos autorais.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">7. Limitação de Responsabilidade</h3>
              <p>
                Na máxima extensão permitida por lei, não seremos responsáveis por:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Danos indiretos, incidentais ou consequentes</li>
                <li>Perda de dados ou lucros</li>
                <li>Interrupção do serviço</li>
                <li>Erros ou omissões</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">8. Isenção de Garantias</h3>
              <p>
                O serviço é fornecido "como está" sem garantias de qualquer tipo, expressas ou implícitas. Não garantimos que o serviço será ininterrupto ou livre de erros.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">9. Suspensão e Encerramento</h3>
              <p>
                Podemos suspender ou encerrar sua conta se você violar estes termos. Você pode solicitar a exclusão de sua conta a qualquer momento.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">10. Modificações do Serviço</h3>
              <p>
                Nos reservamos o direito de modificar ou descontinuar o serviço a qualquer momento. Notificaremos você sobre mudanças significativas.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">11. Lei Aplicável</h3>
              <p>
                Estes termos são regidos pelas leis da República Federativa do Brasil, especificamente pelo estado de São Paulo.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">12. Resolução de Disputas</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Você concorda em tentar resolver disputas através de negociação</li>
                <li>Se a negociação falhar, as disputas serão resolvidas em arbitragem</li>
                <li>Você concorda em renunciar ao direito de ação judicial</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">13. Contato</h3>
              <p>
                Para perguntas sobre estes termos, entre em contato:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Email: legal@ilusaocelestial.com</li>
                <li>Formulário de contato: [Link]</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">14. Alterações aos Termos</h3>
              <p>
                Podemos atualizar estes termos periodicamente. Continuando a usar o serviço após as alterações, você concorda com os novos termos.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
