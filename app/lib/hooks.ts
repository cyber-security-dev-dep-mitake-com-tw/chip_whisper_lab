"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./api-client";
import type { Experiment, Trace, Attack, Target, Report, CurriculumModule } from "./types";

export function useExperiments(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: ["experiments", page, pageSize],
    queryFn: () => api.getExperiments(page, pageSize),
  });
}

export function useCreateExperiment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createExperiment,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["experiments"] }),
  });
}

export function useUpdateExperiment(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Partial<Experiment>) => api.updateExperiment(id, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["experiments"] }),
  });
}

export function useDeleteExperiment(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.deleteExperiment(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["experiments"] }),
  });
}

export function useTraces(experimentId?: string, page = 1, pageSize = 20) {
  return useQuery({
    queryKey: ["traces", experimentId, page, pageSize],
    queryFn: () => api.getTraces(experimentId, page, pageSize),
  });
}

export function useUploadTrace(experimentId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: { file: File; traceSetName?: string }) =>
      api.uploadTrace(experimentId, params.file, params.traceSetName),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["traces"] }),
  });
}

export function useAttacks(experimentId?: string, page = 1, pageSize = 20) {
  return useQuery({
    queryKey: ["attacks", experimentId, page, pageSize],
    queryFn: () => api.getAttacks(experimentId, page, pageSize),
  });
}

export function useCreateAttack() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createAttack,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["attacks"] }),
  });
}

export function useAttackResults(id: string) {
  return useQuery({
    queryKey: ["attack-results", id],
    queryFn: () => api.getAttackResults(id),
    enabled: !!id,
  });
}

export function useTargets(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: ["targets", page, pageSize],
    queryFn: () => api.getTargets(page, pageSize),
  });
}

export function useRegisterTarget() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.registerTarget,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["targets"] }),
  });
}

export function useReports(experimentId?: string) {
  return useQuery({
    queryKey: ["reports", experimentId],
    queryFn: () => api.getReports(experimentId),
  });
}

export function useGenerateReport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.generateReport,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reports"] }),
  });
}

export function useCurriculumModules() {
  return useQuery<CurriculumModule[]>({
    queryKey: ["modules"],
    queryFn: () => fetch("/api/modules").then((r) => r.json()),
  });
}