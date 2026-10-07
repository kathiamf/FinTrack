import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useCategories } from '@/hooks/useCategories';
import { colors, radius, spacing } from '@/theme';
import type { Transaction } from '@/types';
import { safeIcon } from '@/utils/icons';
import { formatMoney } from '@/utils/money';
import { Button } from './Button';

interface ImportedTransactionFormProps {
  transaction: Transaction;
  submitting: boolean;
  onSubmit: (categoryId: string) => void;
}

export function ImportedTransactionForm({
  transaction,
  submitting,
  onSubmit,
}: ImportedTransactionFormProps) {
  const { data: categories = [] } = useCategories();
  const [selected, setSelected] = useState(transaction.category_id ?? '');

  const options = useMemo(
    () => categories.filter((c) => c.type === transaction.type),
    [categories, transaction.type],
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lançamento importado</Text>
      <Text style={styles.subtitle}>
        Importado via Open Finance ({transaction.account_name ?? 'Banco'}). Os dados
        originais do banco não podem ser alterados, apenas a categoria.
      </Text>

      <View style={styles.details}>
        <Text style={styles.description}>{transaction.description}</Text>
        <Text style={styles.amount}>{formatMoney(transaction.amount)}</Text>
      </View>

      <Text style={styles.label}>Categoria</Text>
      <View style={styles.chips}>
        {options.map((category) => {
          const isSelected = category.id === selected;
          return (
            <Pressable
              key={category.id}
              onPress={() => setSelected(category.id)}
              style={[
                styles.chip,
                isSelected && {
                  backgroundColor: category.color,
                  borderColor: category.color,
                },
              ]}
            >
              <Ionicons
                name={safeIcon(category.icon)}
                size={16}
                color={isSelected ? '#FFFFFF' : category.color}
              />
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                {category.name}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Button
        title="Salvar categoria"
        onPress={() => onSubmit(selected)}
        loading={submitting}
        disabled={!selected}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.sm },
  title: { fontSize: 20, fontWeight: '700', color: colors.text },
  subtitle: { fontSize: 14, color: colors.muted, marginBottom: spacing.sm },
  details: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
  },
  description: { fontSize: 16, fontWeight: '600', color: colors.text },
  amount: { fontSize: 18, fontWeight: '700', color: colors.primary, marginTop: 4 },
  label: { fontSize: 14, fontWeight: '600', color: colors.text },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  chipText: { fontSize: 14, color: colors.text },
  chipTextSelected: { color: '#FFFFFF', fontWeight: '700' },
});