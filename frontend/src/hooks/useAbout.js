import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { aboutService } from '../services/about.service';

const KEYS = {
  all: ['about'],
  stats: ['about', 'stats'],
  story: ['about', 'story'],
  experiences: ['about', 'experiences'],
  members: ['about', 'members'],
  certificates: ['about', 'certificates'],
};

// ─── PUBLIC ──────────────────────────────────────────────
export function useAboutData() {
  return useQuery({
    queryKey: KEYS.all,
    queryFn: () => aboutService.getAll().then((r) => r.data),
  });
}

// ─── STATS ───────────────────────────────────────────────
export function useAboutStats() {
  return useQuery({
    queryKey: KEYS.stats,
    queryFn: () => aboutService.getStats().then((r) => r.data),
  });
}

export function useCreateStat() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => aboutService.createStat(data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.stats }),
  });
}

export function useUpdateStat() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => aboutService.updateStat(id, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.stats }),
  });
}

export function useDeleteStat() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => aboutService.deleteStat(id).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.stats }),
  });
}

// ─── STORY ───────────────────────────────────────────────
export function useAboutStory() {
  return useQuery({
    queryKey: KEYS.story,
    queryFn: () => aboutService.getStory().then((r) => r.data),
  });
}

export function useUpsertStory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => aboutService.upsertStory(data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.story }),
  });
}

// ─── EXPERIENCES ─────────────────────────────────────────
export function useAboutExperiences() {
  return useQuery({
    queryKey: KEYS.experiences,
    queryFn: () => aboutService.getExperiences().then((r) => r.data),
  });
}

export function useCreateExperience() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => aboutService.createExperience(data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.experiences }),
  });
}

export function useUpdateExperience() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => aboutService.updateExperience(id, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.experiences }),
  });
}

export function useDeleteExperience() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => aboutService.deleteExperience(id).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.experiences }),
  });
}

// ─── TEAM MEMBERS ────────────────────────────────────────
export function useAboutMembers() {
  return useQuery({
    queryKey: KEYS.members,
    queryFn: () => aboutService.getMembers().then((r) => r.data),
  });
}

export function useCreateMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => aboutService.createMember(data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.members }),
  });
}

export function useUpdateMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => aboutService.updateMember(id, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.members }),
  });
}

export function useDeleteMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => aboutService.deleteMember(id).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.members }),
  });
}

// ─── CERTIFICATES ────────────────────────────────────────
export function useAboutCertificates() {
  return useQuery({
    queryKey: KEYS.certificates,
    queryFn: () => aboutService.getCertificates().then((r) => r.data),
  });
}

export function useCreateCertificate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => aboutService.createCertificate(data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.certificates }),
  });
}

export function useUpdateCertificate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => aboutService.updateCertificate(id, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.certificates }),
  });
}

export function useDeleteCertificate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => aboutService.deleteCertificate(id).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.certificates }),
  });
}
