import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { AutoChart } from './AutoChart';
import {
    TextInput,
    CurrencyInput,
    PercentageInput,
    DateInput
} from './InputComponents';

export const CalculatorBase = ({ config }) => {
    const [results, setResults] = useState(null);

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(config.schema),
        defaultValues: config.defaultValues,
        mode: 'onSubmit',
    });

    const onSubmit = (data) => {
        setResults(config.calculate(data));
    };

    const handleReset = () => {
        reset(config.defaultValues);
        setResults(null);
    };

    const formatValue = (value, format) => {
        if (value == null) return 'N/A';

        switch (format) {
            case 'currency':
                return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                }).format(value);

            case 'percentage':
                return `${value.toFixed(2)}%`;

            case 'number':
                return new Intl.NumberFormat('en-US').format(value);

            default:
                return value;
        }
    };

    /* Input Renderer */
    const renderInput = (input) => {
        const { type, name, placeholder, step, options, format } = input;

        const common = { placeholder };

        // Select
        if (type === 'select') {
            return (
                <select
                    {...register(name)}
                    className="w-full px-3 py-2 border-2 border-bold-blue rounded-lg focus:ring-2 focus:ring-bold-blue font-work-sans"
                >
                    {options.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            );
        }

        // Checkbox
        if (type === 'checkbox') {
            return (
                <input
                    type="checkbox"
                    {...register(name)}
                    className="w-5 h-5 border-2 border-bold-blue rounded focus:ring-2 focus:ring-bold-blue"
                />
            );
        }

        // Currency, Percentage, Date, Text (Controller)
        const componentMap = {
            currency: CurrencyInput,
            percentage: PercentageInput,
            date: DateInput,
            text: TextInput
        };

        if (format && componentMap[format]) {
            const Component = componentMap[format];
            return (
                <Controller
                    name={name}
                    control={control}
                    render={({ field }) => (
                        <Component {...field} {...common} step={step} />
                    )}
                />
            );
        }

        // Number (Controller for consistent default handling)
        if (type === 'number') {
            return (
                <Controller
                    name={name}
                    control={control}
                    render={({ field }) => (
                        <input
                            type="number"
                            value={field.value ?? ''}
                            onChange={(e) => {
                                const val = e.target.value;
                                field.onChange(val === '' ? null : parseFloat(val));
                            }}
                            onBlur={field.onBlur}
                            step={step}
                            className="w-full px-3 py-2 border-2 border-bold-blue rounded-lg focus:ring-2 focus:ring-bold-blue font-work-sans"
                        />
                    )}
                />
            );
        }

        // Fallback (uncommon inputs)
        return (
            <input
                type={type}
                {...register(name)}
                {...common}
                step={step}
                className="w-full px-3 py-2 border-2 border-bold-blue rounded-lg focus:ring-2 focus:ring-bold-blue font-work-sans"
            />
        );
    };

    /* RENDER */
    return (
        <div className="max-w-6xl mx-auto px-10 py-16">

            {/* Header */}
            <div className="mb-12 text-center">
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-black font-songer">
                    {config.title}
                </h1>
                <p className="text-black text-lg mt-6 font-work-sans">
                    {config.description}
                </p>
            </div>

            {/* Form + Results */}
            <div className="grid lg:grid-cols-2 gap-6">

                {/* Form */}
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    <h2 className="text-2xl font-bold mb-6 text-dark-blue font-songer">
                        Input Values
                    </h2>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {config.inputs.map(input => (
                            <div key={input.name}>
                                <label className="block text-sm font-medium text-black mb-1 font-work-sans">
                                    {input.label}
                                    {input.required && <span className="text-red-500 ml-1">*</span>}
                                </label>

                                {renderInput(input)}

                                {/* Validation Errors - only shown after submit */}
                                {errors[input.name] && (
                                    <p className="text-red-500 text-sm mt-1 font-work-sans">
                                        {errors[input.name].message}
                                    </p>
                                )}

                                {input.hint && (
                                    <p className="text-text-light-blue text-xs mt-1 font-work-sans">
                                        {input.hint}
                                    </p>
                                )}
                            </div>
                        ))}

                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                className="flex-1 bg-bold-blue text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-white hover:text-bold-blue hover:border-2 hover:border-bold-blue transition-colors"
                            >
                                Calculate
                            </button>

                            <button
                                type="button"
                                onClick={handleReset}
                                className="px-8 py-3 bg-white text-bold-blue border-2 border-bold-blue font-bold rounded-lg shadow-sm hover:bg-bold-blue hover:text-white transition-colors"
                            >
                                Reset
                            </button>
                        </div>
                    </form>
                </div>

                {/* Results */}
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    <h2 className="text-2xl font-bold mb-6 text-dark-blue font-songer">Results</h2>

                    {!results ? (
                        <div className="text-center py-12 text-text-light-blue">
                            <div className="text-6xl mb-4 opacity-50">📈</div>
                            <p className="font-work-sans">Enter values and click Calculate to see results</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {config.results.map(result => (
                                <div key={result.key} className="border-b border-bold-blue pb-4">
                                    <p className="text-sm text-text-light-blue mb-1 font-work-sans">
                                        {result.label}
                                    </p>
                                    <p className="text-2xl font-bold text-dark-blue font-songer">
                                        {formatValue(results[result.key], result.format)}
                                    </p>

                                    {result.description && (
                                        <p className="text-xs text-text-light-blue mt-1 font-work-sans">
                                            {result.description}
                                        </p>
                                    )}
                                </div>
                            ))}

                            {/* Notes */}
                            {results.notes?.length > 0 && (
                                <div className="mt-6 pt-4 border-t border-bold-blue">
                                    <h3 className="font-bold mb-3 text-dark-blue font-songer">Notes</h3>
                                    <ul className="space-y-2 text-sm font-work-sans">
                                        {results.notes.map((note, idx) => (
                                            <li key={idx} className="text-text-light-blue flex">
                                                <span className="mr-2">•</span> {note}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Breakdown */}
                            {results.breakdown && (
                                <div className="mt-6 pt-4 border-t border-bold-blue">
                                    <h3 className="font-bold mb-3 text-dark-blue font-songer">Breakdown</h3>
                                    <div className="space-y-2 text-sm font-work-sans">
                                        {results.breakdown.map((item, idx) => (
                                            <div key={idx} className="flex justify-between">
                                                <span className="text-text-light-blue">{item.label}</span>
                                                <span className="font-medium text-black">
                                                    {formatValue(item.value, item.format)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Charts */}
            {results && config.charts?.length > 0 && (
                <div className="mt-6 space-y-6">
                    {config.charts.map((chartConfig, index) => (
                        <div key={index} className="bg-white rounded-2xl shadow-2xl p-8">
                            <h2 className="text-2xl font-bold mb-6 text-dark-blue font-songer">
                                {chartConfig.title}
                            </h2>
                            <AutoChart config={chartConfig} results={results} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};