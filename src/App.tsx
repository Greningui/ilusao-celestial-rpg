import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import MainMenu from "./pages/MainMenu";
import Dashboard from "./pages/Dashboard";
import CharacterPage from "./pages/CharacterPage";
import AdminPanel from "./pages/AdminPanel";
import AdminUserCharacters from "./pages/AdminUserCharacters";
import AdminCharacterPage from "./pages/AdminCharacterPage";
import SkillsListPage from "./pages/SkillsListPage";
import SkillCategoryPage from "./pages/SkillCategoryPage";
import CreateSkillPage from "./pages/CreateSkillPage";
import CreateJutsuPage from "./pages/CreateJutsuPage";
import CreateCursedTechniquePage from "./pages/CreateCursedTechniquePage";
import CreateIndividualityPage from "./pages/CreateIndividualityPage";
import CreateBreathingPage from "./pages/CreateBreathingPage";
import WeaponsListPage from "./pages/WeaponsListPage";
import WeaponCategoryPage from "./pages/WeaponCategoryPage";
import CreateWeaponPage from "./pages/CreateWeaponPage";
import ArmorsListPage from "./pages/ArmorsListPage";
import ArmorCategoryPage from "./pages/ArmorCategoryPage";
import CreateArmorPage from "./pages/CreateArmorPage";
import ItemsListPage from "./pages/ItemsListPage";
import ItemCategoryPage from "./pages/ItemCategoryPage";
import CreateItemPage from "./pages/CreateItemPage";
import CampaignsListPage from "./pages/CampaignsListPage";
import CreateCampaignPage from "./pages/CreateCampaignPage";
import CampaignDetailPage from "./pages/CampaignDetailPage";
import BestiaryListPage from "./pages/BestiaryListPage";
import BestiaryCategoryPage from "./pages/BestiaryCategoryPage";
import CreateBestiaryPage from "./pages/CreateBestiaryPage";
import EditBestiaryPage from "./pages/EditBestiaryPage";
import ProfilePage from "./pages/ProfilePage";
import Setup2FAPage from "./pages/Setup2FAPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import NotFound from "./pages/NotFound";
import { ScrollToTop } from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/menu" element={<MainMenu />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/character/:id" element={<CharacterPage />} />
            <Route path="/skills" element={<SkillsListPage />} />
            <Route path="/skills/:slug" element={<SkillCategoryPage />} />
            <Route path="/skills/:slug/create-skill" element={<CreateSkillPage />} />
            <Route path="/skills/:slug/create-jutsu" element={<CreateJutsuPage />} />
            <Route path="/skills/:slug/create-technique" element={<CreateCursedTechniquePage />} />
            <Route path="/skills/:slug/create-individuality" element={<CreateIndividualityPage />} />
            <Route path="/skills/respiracao/create-breathing" element={<CreateBreathingPage />} />
            <Route path="/weapons" element={<WeaponsListPage />} />
            <Route path="/weapons/:slug" element={<WeaponCategoryPage />} />
            <Route path="/weapons/:slug/create" element={<CreateWeaponPage />} />
            <Route path="/armors" element={<ArmorsListPage />} />
            <Route path="/armors/:slug" element={<ArmorCategoryPage />} />
            <Route path="/armors/:slug/create" element={<CreateArmorPage />} />
            <Route path="/items" element={<ItemsListPage />} />
            <Route path="/items/:slug" element={<ItemCategoryPage />} />
            <Route path="/items/:slug/create" element={<CreateItemPage />} />
            <Route path="/campaigns" element={<CampaignsListPage />} />
            <Route path="/campaigns/create" element={<CreateCampaignPage />} />
            <Route path="/campaigns/:id" element={<CampaignDetailPage />} />
            <Route path="/bestiary" element={<BestiaryListPage />} />
            <Route path="/bestiary/:slug" element={<BestiaryCategoryPage />} />
            <Route path="/bestiary/:slug/create" element={<CreateBestiaryPage />} />
            <Route path="/bestiary/:slug/edit/:id" element={<EditBestiaryPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/2fa-setup" element={<Setup2FAPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsOfServicePage />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/admin/user/:userId" element={<AdminUserCharacters />} />
            <Route path="/admin/user/:userId/character/:id" element={<AdminCharacterPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
