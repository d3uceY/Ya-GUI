import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"

interface Props {
    open: boolean
    variables: string[]
    values: Record<string, string>
    onChange: (variable: string, value: string) => void
    onConfirm: () => void
    onCancel: () => void
}

export default function VarSubstitutionDialog({ open, variables, values, onChange, onConfirm, onCancel }: Props) {
    const allFilled = variables.every((v) => (values[v] ?? "").trim() !== "")

    return (
        <AlertDialog open={open}>
            <AlertDialogContent className="max-w-md">
                <AlertDialogTitle>Fill in Variables</AlertDialogTitle>
                <AlertDialogDescription>
                    This command contains variables. Enter a value for each one before running.
                </AlertDialogDescription>

                <div className="my-2 space-y-4">
                    {variables.map((variable, i) => (
                        <div key={variable}>
                            <label className="mono-cell mb-1.5 block text-[13px] font-medium text-accent-soft">
                                {"{"}{variable}{"}"}
                            </label>
                            <Input
                                placeholder={`Value for ${variable}`}
                                value={values[variable] ?? ""}
                                onChange={(e) => onChange(variable, e.target.value)}
                                className="font-mono"
                                autoFocus={i === 0}
                            />
                        </div>
                    ))}
                </div>

                <div className="mt-2 flex justify-end gap-2">
                    <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm} disabled={!allFilled}>
                        Continue →
                    </AlertDialogAction>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    )
}
