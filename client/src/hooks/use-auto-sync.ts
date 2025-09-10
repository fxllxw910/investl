import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useSyncDocuments } from "@/hooks/use-sync-documents";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface DocumentCount {
  contracts: number;
  acts: number;
  invoices: number;
}

export function useAutoSync() {
  const { isAuthenticated, user } = useAuth();
  const syncDocuments = useSyncDocuments();
  const [hasAttemptedSync, setHasAttemptedSync] = useState(false);
  
  // Mutation for loading customer profile data
  const loadCustomerData = useMutation({
    mutationFn: () => apiRequest("POST", "/api/load-customer-data").then(res => res.json()),
    onSuccess: () => {
      // Invalidate and refetch company and contact data
      queryClient.invalidateQueries({ queryKey: ["/api/company"] });
      queryClient.invalidateQueries({ queryKey: ["/api/contact"] });
      queryClient.invalidateQueries({ queryKey: ["/api/payment-schedules"] });
    },
    onError: (error) => {
      console.error("Error loading customer data:", error);
    }
  });

  // Check if user has any documents
  const { data: contractsData } = useQuery({
    queryKey: ["/api/contracts"],
    enabled: isAuthenticated,
    queryFn: () => apiRequest("GET", "/api/contracts").then(res => res.json()),
  });

  const { data: actsData } = useQuery({
    queryKey: ["/api/acts"],
    enabled: isAuthenticated,
    queryFn: () => apiRequest("GET", "/api/acts").then(res => res.json()),
  });

  const { data: invoicesData } = useQuery({
    queryKey: ["/api/invoices"],
    enabled: isAuthenticated,
    queryFn: () => apiRequest("GET", "/api/invoices").then(res => res.json()),
  });

  useEffect(() => {
    // Only run auto-sync once per session and only for authenticated users
    if (!isAuthenticated || !user || hasAttemptedSync) {
      return;
    }

    // Check if all document queries have loaded
    const documentsLoaded = 
      contractsData !== undefined && 
      actsData !== undefined && 
      invoicesData !== undefined;

    if (!documentsLoaded) {
      return;
    }

    // Check if user has no documents
    const hasNoDocuments = 
      (contractsData?.length || 0) === 0 &&
      (actsData?.length || 0) === 0 &&
      (invoicesData?.length || 0) === 0;

    if (hasNoDocuments && (user.inn || user.email)) {
      // User has no documents and has INN or email - trigger sync and customer data load
      console.log("No documents found for user, starting automatic sync and loading customer data...");
      loadCustomerData.mutate();
      syncDocuments.mutate();
      setHasAttemptedSync(true);
    } else if (user.inn || user.email) {
      // User has documents but may need customer data refresh
      console.log("Loading customer data...");
      loadCustomerData.mutate();
      setHasAttemptedSync(true);
    } else {
      // User has no INN or email - mark as attempted to avoid future checks
      setHasAttemptedSync(true);
    }
  }, [
    isAuthenticated,
    user,
    contractsData,
    actsData,
    invoicesData,
    hasAttemptedSync,
    syncDocuments,
    loadCustomerData
  ]);

  return {
    isAutoSyncing: syncDocuments.isPending && !hasAttemptedSync,
    hasAttemptedSync,
  };
}