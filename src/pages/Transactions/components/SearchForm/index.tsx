import { MagnifyingGlass } from "phosphor-react";
import { SearchFormContainer } from "./styles";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { TransactionsContext } from "../../../../contexts/TransactionsContext";
import { useContextSelector } from "use-context-selector";

const searchFormSchema = z.object({
  query: z.string(),
});

type searchFormInputs = z.infer<typeof searchFormSchema>;

export function SearchForm() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<searchFormInputs>({
    resolver: zodResolver(searchFormSchema),
  });
  const fetchTransactions = useContextSelector(
    TransactionsContext,
    (context) => {
      return context.fetchTransactions;
    }
  );

  async function handleSearchTransactions(data: searchFormInputs) {
    await fetchTransactions(data.query);
  }

  return (
    <div>
      <SearchFormContainer onSubmit={handleSubmit(handleSearchTransactions)}>
        <input
          type="text"
          placeholder="Busque por transações"
          {...register("query")}
        />
        <button type="submit" disabled={isSubmitting}>
          <MagnifyingGlass size={20} />
          Pesquisar
        </button>
      </SearchFormContainer>
    </div>
  );
}
