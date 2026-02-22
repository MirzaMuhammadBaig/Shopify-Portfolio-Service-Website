import { useQuery } from '@tanstack/react-query';
import { adminService } from '../services/admin.service';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: () => adminService.getDashboardStats().then((res) => res.data),
  });
}
