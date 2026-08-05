'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from './client';
import { mapTransaction, mapBudget, mapCategory, mapProfile } from './mappers';
import type { Transaction, Budget, Category, UserProfile } from '@/types';

// ---------- Auth ----------

export function useUser() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return { user, loading };
}

// ---------- Transactions ----------

export function useTransactions() {
  const { user } = useUser();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user) {
      setTransactions([]);
      setLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setTransactions((data ?? []).map(mapTransaction));
      setError(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { transactions, loading, error, refresh };
}

export async function addTransaction(input: {
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: Date;
  paymentMethod: string;
}) {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('transactions')
    .insert({
      user_id: user.user.id,
      type: input.type,
      amount: input.amount,
      category: input.category,
      description: input.description,
      date: input.date.toISOString(),
      payment_method: input.paymentMethod,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return mapTransaction(data);
}

export async function updateTransaction(id: string, input: {
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: Date;
  paymentMethod: string;
}) {
  const { error } = await supabase
    .from('transactions')
    .update({
      type: input.type,
      amount: input.amount,
      category: input.category,
      description: input.description,
      date: input.date.toISOString(),
      payment_method: input.paymentMethod,
    })
    .eq('id', id);

  if (error) throw error;
}

export async function deleteTransaction(id: string) {
  const { error } = await supabase.from('transactions').delete().eq('id', id);
  if (error) throw error;
}

// ---------- Budgets ----------

export function useBudgets() {
  const { user } = useUser();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user) {
      setBudgets([]);
      setLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBudgets((data ?? []).map(mapBudget));
      setError(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { budgets, loading, error, refresh };
}

export async function addBudget(input: {
  category: string;
  budgetLimit: number;
  month: number;
  year: number;
}) {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('budgets')
    .insert({
      user_id: user.user.id,
      category: input.category,
      budget_limit: input.budgetLimit,
      spent: 0,
      month: input.month,
      year: input.year,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return mapBudget(data);
}

// ---------- Categories ----------

export function useCategories() {
  const { user } = useUser();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user) {
        setCategories([]);
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('user_id', user.id)
          .order('name');

        if (error) throw error;
        setCategories((data ?? []).map(mapCategory));
      } catch (e) {
        console.error('Failed to load categories:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  return { categories, loading };
}

// ---------- Profile ----------

export function useProfile() {
  const { user } = useUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setProfile(mapProfile(data));
      } catch (e) {
        console.error('Failed to load profile:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  return { profile, loading };
}

export async function updateProfile(input: {
  name: string;
  currency?: string;
  monthlyIncome?: number;
}) {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('profiles')
    .update(input)
    .eq('id', user.user.id);

  if (error) throw error;
}
