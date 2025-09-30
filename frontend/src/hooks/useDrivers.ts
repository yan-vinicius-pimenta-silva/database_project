import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/api";

export function useDrivers() {
  const qc = useQueryClient();

  const list = useQuery({
    queryKey: ["drivers"],
    queryFn: async () => (await api.get("/drivers")).data
  });

  const create = useMutation({
    mutationFn: (d: any) => api.post("/drivers", d),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["drivers"] })
  });

  const update = useMutation({
    mutationFn: (d: any) => api.put(`/drivers/${d.id}`, d),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["drivers"] })
  });

  const remove = useMutation({
    mutationFn: (id: number) => api.delete(`/drivers/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["drivers"] })
  });

  return { list, create, update, remove };
}
