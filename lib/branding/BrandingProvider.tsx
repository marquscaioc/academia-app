import { createContext, ReactNode, useContext } from "react";
import { useAuth } from "../auth/provider";
import { useTrainerBranding, TrainerBrand } from "../../hooks/queries/useTrainerBranding";

interface BrandingContextType {
  brand: TrainerBrand | null;
  primaryColor: string;
  brandName: string | null;
  logoUrl: string | null;
}

const BrandingContext = createContext<BrandingContextType>({
  brand: null,
  primaryColor: "#781BB6",
  brandName: null,
  logoUrl: null,
});

export function BrandingProvider({ children }: { children: ReactNode }) {
  const { user, role } = useAuth();
  const { data: brand } = useTrainerBranding(role === "student" ? user?.id : undefined);

  return (
    <BrandingContext.Provider
      value={{
        brand: brand ?? null,
        primaryColor: brand?.brandPrimaryColor ?? "#781BB6",
        brandName: brand?.brandName ?? null,
        logoUrl: brand?.brandLogoUrl ?? null,
      }}
    >
      {children}
    </BrandingContext.Provider>
  );
}

export function useBranding() {
  return useContext(BrandingContext);
}
