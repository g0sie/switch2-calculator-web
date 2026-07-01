import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Game } from "../components/GamesList";
import type { Expense } from "../components/ExpensesList";

export function subscribeToGames(callback: (games: Game[]) => void): Unsubscribe {
  return onSnapshot(collection(db, "games"), (snapshot) => {
    const games = snapshot.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        title: data.title,
        hoursPlayed: data.hoursPlayed ?? null,
        coverColor: data.coverColor,
        coverInitials: data.coverInitials,
      } as Game;
    });
    callback(games);
  });
}

export function subscribeToExpenses(callback: (expenses: Expense[]) => void): Unsubscribe {
  return onSnapshot(collection(db, "expenses"), (snapshot) => {
    const expenses = snapshot.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        title: data.title,
        amount: data.amount,
        type: data.type,
        date: data.date.toDate(),
        isGift: data.isGift,
        linkedGameIds: data.linkedGameIds ?? [],
      } as Expense;
    });
    callback(expenses);
  });
}

export async function addGame(game: Omit<Game, "id">) {
  await addDoc(collection(db, "games"), { ...game, createdAt: serverTimestamp() });
}

export async function updateGame(id: string, fields: Partial<Omit<Game, "id">>) {
  await updateDoc(doc(db, "games", id), fields);
}

export async function deleteGame(id: string) {
  await deleteDoc(doc(db, "games", id));
}

export async function addExpense(expense: Omit<Expense, "id">) {
  await addDoc(collection(db, "expenses"), { ...expense, createdAt: serverTimestamp() });
}

export async function updateExpense(id: string, fields: Partial<Omit<Expense, "id">>) {
  await updateDoc(doc(db, "expenses", id), fields);
}

export async function deleteExpense(id: string) {
  await deleteDoc(doc(db, "expenses", id));
}
