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
            <AlertDialogContent className="border-2 bg-slate-800 border-slate-700 max-w-md">
                <AlertDialogTitle className="text-xl font-bold text-blue-100">
                    Fill in Variables
                </AlertDialogTitle>
                <AlertDialogDescription className="text-slate-300 text-sm">
                    This command contains variables. Enter values for each one before running.
                </AlertDialogDescription>

                <div className="space-y-4 my-2">
                    {variables.map((variable) => (
                        <div key={variable}>
                            <label className="block text-sm font-bold text-blue-200 mb-1">
                                {"{"}
                                {variable}
                                {"}"}
                            </label>
                            <Input
                                placeholder={`Value for ${variable}`}
                                value={values[variable] ?? ""}
                                onChange={(e) => onChange(variable, e.target.value)}
                                className="border-2 border-slate-600 bg-slate-900/50 text-blue-200 placeholder:text-slate-500 focus:border-blue-500"
                                autoFocus={variables.indexOf(variable) === 0}
                            />
                        </div>
                    ))}
                </div>

                <div className="flex gap-3 justify-end mt-2">
                    <AlertDialogCancel
                        className="border-2 border-slate-600 bg-slate-900 text-slate-200 hover:bg-slate-800"
                        onClick={onCancel}
                    >
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                        onClick={onConfirm}
                        disabled={!allFilled}
                    >
                        Continue →
                    </AlertDialogAction>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    )
}
