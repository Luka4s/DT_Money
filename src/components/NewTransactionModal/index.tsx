import * as Dialog from "@radix-ui/react-dialog";
import {
  CloseButton,
  Content,
  Overlay,
  TransactionType,
  TransactionTypeButton,
} from "./styles";
import { ArrowCircleDown, ArrowCircleUp, X } from "phosphor-react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { TransactionsContext } from "../../contexts/TransactionsContext";
import { useContextSelector } from "use-context-selector";

//Formato de dados que iremos receber
const newTransactionsFormSchema = z.object({
  description: z.string(),
  price: z.number(),
  category: z.string(),
  type: z.enum(["income", "outcome"]),
});

type newTransactionsFormInputs = z.infer<typeof newTransactionsFormSchema>;

export function NewTransactionModal() {
  const createdTransaction = useContextSelector(
    TransactionsContext,
    (context) => {
      return context.createdTransaction;
    }
  );

  const {
    control,
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<newTransactionsFormInputs>({
    resolver: zodResolver(newTransactionsFormSchema),
  });

  async function handleCreatedNewTransaction(data: newTransactionsFormInputs) {
    const { description, price, category, type } = data;
    await createdTransaction({
      description,
      price,
      category,
      type,
    });
    reset();
  }

  return (
    <Dialog.Portal>
      <Overlay />
      <Content>
        <Dialog.Title>Nova Transação</Dialog.Title>

        <CloseButton>
          <X size={22} />
        </CloseButton>

        <form onSubmit={handleSubmit(handleCreatedNewTransaction)}>
          <input
            type="text"
            placeholder="Descrição"
            required
            {...register("description")}
          />
          <input
            type="number"
            placeholder="Preço"
            required
            {...register("price", { valueAsNumber: true })}
          />
          <input
            type="text"
            placeholder="Categoria"
            required
            {...register("category")}
          />
          <Controller
            control={control}
            name="type"
            render={({ field }) => {
              return (
                <TransactionType
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <TransactionTypeButton variant="income" value={"income"}>
                    <ArrowCircleUp size={22} />
                    Entrada
                  </TransactionTypeButton>
                  <TransactionTypeButton variant="outcome" value={"outcome"}>
                    <ArrowCircleDown size={22} />
                    Saída
                  </TransactionTypeButton>
                </TransactionType>
              );
            }}
          />

          <button type="submit" disabled={isSubmitting}>
            Cadastrar
          </button>
        </form>
      </Content>
    </Dialog.Portal>
  );
}
