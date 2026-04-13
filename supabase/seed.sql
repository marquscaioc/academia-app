-- =============================================
-- SEED DATA - Grupos Musculares e Equipamentos
-- =============================================

-- Grupos Musculares
INSERT INTO public.muscle_groups (name, sort_order) VALUES
  ('Peito', 1),
  ('Costas', 2),
  ('Ombros', 3),
  ('Bíceps', 4),
  ('Tríceps', 5),
  ('Antebraço', 6),
  ('Abdômen', 7),
  ('Quadríceps', 8),
  ('Posterior de Coxa', 9),
  ('Glúteos', 10),
  ('Panturrilha', 11),
  ('Trapézio', 12),
  ('Lombar', 13);

-- Equipamentos
INSERT INTO public.equipment (name) VALUES
  ('Barra'),
  ('Halteres'),
  ('Máquina'),
  ('Cabo/Polia'),
  ('Kettlebell'),
  ('Elástico/Banda'),
  ('Peso Corporal'),
  ('Barra Fixa'),
  ('Banco'),
  ('Smith Machine'),
  ('Corda'),
  ('Anilha'),
  ('Bola Suíça'),
  ('TRX/Suspensão'),
  ('Rolo de Espuma');
