# 🚀 Guia de Deploy - Ilusão Celestial RPG

## Pré-requisitos

- [ ] Conta GitHub (você tem ✅)
- [ ] Conta Supabase (vamos criar)
- [ ] Conta Vercel (vamos criar)

---

## Passo 1: Configurar Supabase

### 1.1 Criar Projeto Supabase
1. Acesse: https://supabase.com
2. Clique em "Start your project"
3. Faça login com Google (use: gg9oninja.sacana@gmail.com)
4. Crie um novo projeto:
   - **Nome**: ilusao-celestial-rpg
   - **Senha do banco**: Crie uma senha forte
   - **Região**: São Paulo (sa-east-1)
5. Aguarde 2-3 minutos para criar

### 1.2 Obter Credenciais
1. Após criar, vá para **Settings** → **API**
2. Copie:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJxxx...`
3. Guarde essas informações

### 1.3 Aplicar Migrações
1. No Supabase, vá para **SQL Editor**
2. Clique em "New Query"
3. Copie e cole o conteúdo de:
   ```
   supabase/migrations/20260310230000_add_equipment_tables.sql
   supabase/migrations/20260310235000_add_creator_and_master_roles.sql
   supabase/migrations/20260311000000_add_campaigns_and_bestiary.sql
   supabase/migrations/20260311010000_add_phone_profile_notifications.sql
   supabase/migrations/20260311020000_add_security_features.sql
   ```
4. Execute cada uma (uma por vez)

---

## Passo 2: Configurar Vercel

### 2.1 Conectar GitHub com Vercel
1. Acesse: https://vercel.com
2. Clique em "Sign Up"
3. Escolha "Continue with GitHub"
4. Autorize Vercel a acessar seu GitHub
5. Selecione o repositório `ilusao-celestial-rpg`

### 2.2 Configurar Variáveis de Ambiente
1. No painel do Vercel, vá para **Settings** → **Environment Variables**
2. Adicione:
   ```
   VITE_SUPABASE_URL = https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY = eyJxxx...
   REACT_APP_ENCRYPTION_KEY = sua-chave-segura-aqui
   REACT_APP_API_URL = https://seu-site.vercel.app
   REACT_APP_ALLOWED_ORIGINS = https://seu-site.vercel.app
   ```

### 2.3 Deploy
1. Clique em "Deploy"
2. Aguarde 2-3 minutos
3. Você receberá um link como: `https://ilusao-celestial-rpg.vercel.app`

---

## Passo 3: Testar o Site

1. Acesse o link gerado
2. Crie uma conta de teste
3. Teste as funcionalidades:
   - [ ] Login/Logout
   - [ ] Criar personagem
   - [ ] Acessar habilidades
   - [ ] Acessar campanhas
   - [ ] Acessar bestiário

---

## Passo 4: Compartilhar Link

Após tudo funcionar, compartilhe no WhatsApp:

```
🎮 Bem-vindo ao Ilusão Celestial RPG! 🎮

Clique no link abaixo para acessar:
https://ilusao-celestial-rpg.vercel.app

Funciona em qualquer navegador:
✅ Google Chrome
✅ Firefox
✅ Opera
✅ Brave
✅ Safari
✅ Edge

Divirta-se! 🚀
```

---

## Troubleshooting

### Erro: "VITE_SUPABASE_URL não definido"
- Verifique se as variáveis de ambiente estão configuradas no Vercel
- Aguarde 5 minutos após adicionar as variáveis
- Faça um novo deploy

### Erro: "Conexão com banco de dados recusada"
- Verifique se as credenciais do Supabase estão corretas
- Verifique se as migrações foram aplicadas
- Verifique se o projeto Supabase está ativo

### Site lento
- Verifique a região do Supabase (deve ser São Paulo)
- Verifique a performance no Vercel Analytics
- Considere usar CDN

---

## Próximos Passos

1. **Domínio Personalizado** (opcional)
   - Compre um domínio (ex: ilusaocelestial.com)
   - Configure no Vercel
   - Atualize as variáveis de ambiente

2. **Monitoramento**
   - Configure alertas no Vercel
   - Monitore logs no Supabase
   - Configure backup automático

3. **Segurança**
   - Mude sua senha do GitHub
   - Ative 2FA no GitHub
   - Ative 2FA no Supabase
   - Ative 2FA no Vercel

---

## Suporte

Se tiver problemas:
1. Verifique os logs no Vercel
2. Verifique os logs no Supabase
3. Consulte a documentação oficial
4. Abra uma issue no GitHub

---

**Data**: 11 de Março de 2026
**Versão**: 3.0
**Status**: Pronto para Deploy
