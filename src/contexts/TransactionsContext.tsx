import { ReactNode, useCallback, useEffect, useState } from "react";
import { api } from "../lib/axios";
import { createContext } from "use-context-selector";

/* 
  Porque um componente renderiza ?
  - Hooks change (mudou estado, contexto, reducer)
  - Props change (mudou propriedades)
  - Parent change (componente pai renderizou)

  Qual o fluxo de renderização ?
  1. O React recria o HTML da interface daquele componente
  2. Compara a versão do HTML recriada com a versão anterior
  3. Se mudou alguma coisa,ele reescreve o HTML na tela

  Memo: 
*/

interface TransactionsProps {
  id: number;
  description: string;
  type: "income" | "outcome";
  category: string;
  price: number;
  createdAt: string;
}

interface CreateTransactionInput {
  description: string;
  price: number;
  category: string;
  type: "income" | "outcome";
}

interface TransactionContextType {
  transactions: TransactionsProps[];
  fetchTransactions: (query?: string) => Promise<void>;
  createdTransaction: (data: CreateTransactionInput) => void;
}

interface TransactionsProviderProps {
  children: ReactNode;
}

export const TransactionsContext = createContext({} as TransactionContextType);

export function TransactionsProvider({ children }: TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<TransactionsProps[]>([]);
  /* Podemos utilizar o useCallback para evitar que os componetes que não dependem das informações 
  dessa função renderizem, assim melhorando o fluxo de renderização da aplicação evitando lentidão.*/
  const fetchTransactions = useCallback(async (query?: string) => {
    const response = await api.get("/transactions", {
      params: {
        _sort: "createdAt",
        _order: "desc",
        q: query,
      },
    });
    setTransactions(response.data);
  }, []);

  const createdTransaction = useCallback(
    async (data: CreateTransactionInput) => {
      const { description, price, category, type } = data;

      const newTransaction = await api.post("/transactions", {
        description,
        price,
        category,
        type,
        createdAt: new Date(),
      });
      setTransactions((state) => [newTransaction.data, ...state]);
    },
    []
  );

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return (
    <TransactionsContext.Provider
      value={{ transactions, fetchTransactions, createdTransaction }}
    >
      {children}
    </TransactionsContext.Provider>
  );
}
