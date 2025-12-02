import React from 'react';

export const TextInput = ({ value, onChange, onBlur, placeholder, disabled, maxLength = 100 }) => {
    const handleChange = (e) => {
        const inputValue = e.target.value;
        if (inputValue.length <= maxLength) {
            onChange(inputValue);
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData('text');
        const truncated = pastedText.slice(0, maxLength);
        onChange(truncated);
    };

    return (
        <input
            type="text"
            value={value || ''}
            onChange={handleChange}
            onPaste={handlePaste}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            maxLength={maxLength}
            className="w-full px-3 py-2 border-2 border-bold-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-bold-blue font-work-sans"
        />
    );
};

export const CurrencyInput = ({ value, onChange, onBlur, placeholder, disabled, maxLength = 15 }) => {
    const handleChange = (e) => {
        const raw = e.target.value.replace(/[^0-9]/g, '');
        
        if (!raw) {
            onChange('');
            return;
        }

        if (raw.length > maxLength) return;

        const num = parseInt(raw, 10);
        if (!isNaN(num) && isFinite(num)) {
            onChange(num);
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData('text');
        const raw = pastedText.replace(/[^0-9]/g, '');

        if (raw && raw.length > 0 && raw.length <= maxLength) {
            const num = parseInt(raw, 10);
            if (!isNaN(num) && isFinite(num)) {
                onChange(num);
            }
        }
    };

    return (
        <div className="relative">
            <span className="absolute left-3 top-2.5 text-gray-600 font-work-sans">$</span>
            <input
                type="text"
                inputMode="numeric"
                value={value ?? ''}
                onChange={handleChange}
                onPaste={handlePaste}
                onBlur={onBlur}
                placeholder={placeholder || '0'}
                disabled={disabled}
                className="w-full pl-8 pr-3 py-2 border-2 border-bold-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-bold-blue font-work-sans"
            />
        </div>
    );
};

export const PercentageInput = ({ value, onChange, onBlur, placeholder, disabled, maxLength = 6, maxDecimals = 2 }) => {
    const handleChange = (e) => {
        const inputValue = e.target.value;

        if (inputValue === '') {
            onChange('');
            return;
        }

        const parts = inputValue.split('.');
        const integerPart = parts[0].replace(/[^0-9-]/g, '');
        const decimalPart = parts[1] || '';

        if (integerPart.replace('-', '').length > maxLength) return;
        if (decimalPart.length > maxDecimals) return;

        const num = parseFloat(inputValue);
        if (!isNaN(num) && isFinite(num)) {
            onChange(num);
        } else if (inputValue === '-') {
            onChange('');
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData('text');
        const raw = pastedText.replace(/[^0-9.-]/g, '');

        const parts = raw.split('.');
        const integerPart = parts[0].replace(/[^0-9-]/g, '');
        const decimalPart = parts[1] || '';

        if (integerPart.replace('-', '').length > maxLength || decimalPart.length > maxDecimals) {
            return;
        }

        if (raw && raw.length > 0) {
            const num = parseFloat(raw);
            if (!isNaN(num) && isFinite(num)) {
                onChange(num);
            }
        }
    };

    return (
        <div className="relative">
            <input
                type="text"
                inputMode="decimal"
                value={value ?? ''}
                onChange={handleChange}
                onPaste={handlePaste}
                onBlur={onBlur}
                placeholder={placeholder || '0'}
                disabled={disabled}
                className="w-full pr-8 pl-3 py-2 border-2 border-bold-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-bold-blue font-work-sans"
            />
            <span className="absolute right-3 top-2.5 text-gray-600 font-work-sans">%</span>
        </div>
    );
};

export const DateInput = ({ value, onChange, onBlur, placeholder, disabled, error }) => {
    const monthRef = React.useRef(null);
    const dayRef = React.useRef(null);
    const yearRef = React.useRef(null);
    const [isInvalid, setIsInvalid] = React.useState(false);

    React.useEffect(() => {
        if (value) {
            try {
                const d = new Date(value + 'T00:00:00');
                if (monthRef.current) monthRef.current.value = (d.getMonth() + 1).toString().padStart(2, '0');
                if (dayRef.current) dayRef.current.value = d.getDate().toString().padStart(2, '0');
                if (yearRef.current) yearRef.current.value = d.getFullYear().toString();
                setIsInvalid(false);
            } catch {
                setIsInvalid(true);
            }
        }
    }, [value]);

    const handleKeyDown = (prevRef) => (e) => {
        if (e.key === 'Backspace' && e.target.value === '' && prevRef?.current) {
            e.preventDefault();
            prevRef.current.focus();
            prevRef.current.select();
        }
    };

    const handleInput = (ref, maxLength, nextRef) => (e) => {
        const val = e.target.value.replace(/[^0-9]/g, '');
        const truncated = val.slice(0, maxLength);

        if (e.target.value !== truncated) {
            e.target.value = truncated;
        }

        if (truncated.length === maxLength && val.length === maxLength && nextRef?.current) {
            nextRef.current.focus();
        }

        updateDate();
    };

    const handlePaste = (e) => {
        const pastedText = e.clipboardData.getData('text');
        const currentInput = e.target;
        const maxLength = parseInt(currentInput.getAttribute('maxLength'));
        const digits = pastedText.replace(/[^0-9]/g, '');

        if (digits.length <= maxLength) {
            setTimeout(() => {
                const val = currentInput.value.replace(/[^0-9]/g, '');
                currentInput.value = val.slice(0, maxLength);
                updateDate();
            }, 0);
            return;
        }

        e.preventDefault();

        let month = '', day = '', year = '';

        if (digits.length === 8) {
            if (parseInt(digits.slice(0, 4)) > 1900) {
                year = digits.slice(0, 4);
                month = digits.slice(4, 6);
                day = digits.slice(6, 8);
            } else {
                month = digits.slice(0, 2);
                day = digits.slice(2, 4);
                year = digits.slice(4, 8);
            }
        } else if (digits.length === 6) {
            month = digits.slice(0, 2);
            day = digits.slice(2, 4);
            const shortYear = digits.slice(4, 6);
            year = (parseInt(shortYear) > 50 ? '19' : '20') + shortYear;
        }

        if (month && day && year) {
            if (monthRef.current) monthRef.current.value = month;
            if (dayRef.current) dayRef.current.value = day;
            if (yearRef.current) yearRef.current.value = year;
            updateDate();
        }
    };

    const updateDate = () => {
        const month = monthRef.current?.value || '';
        const day = dayRef.current?.value || '';
        const year = yearRef.current?.value || '';

        if (month.length === 2 && day.length === 2 && year.length === 4) {
            const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            const d = new Date(isoDate + 'T00:00:00');

            if (d.getMonth() + 1 === parseInt(month) && d.getDate() === parseInt(day)) {
                setIsInvalid(false);
                onChange(isoDate);
                return;
            } else {
                setIsInvalid(true);
            }
        }
        onChange('');
    };

    const borderColor = isInvalid || error ? 'border-red-500' : 'border-bold-blue';

    return (
        <div className="flex items-center gap-1">
            <input
                ref={monthRef}
                type="text"
                inputMode="numeric"
                onInput={handleInput(monthRef, 2, dayRef)}
                onKeyDown={handleKeyDown(null)}
                onPaste={handlePaste}
                onBlur={onBlur}
                placeholder="MM"
                disabled={disabled}
                maxLength={2}
                className={`w-14 px-2 py-2 border-2 ${borderColor} rounded-lg focus:outline-none focus:ring-2 focus:ring-bold-blue font-work-sans text-center`}
            />
            <span className="text-gray-600">/</span>
            <input
                ref={dayRef}
                type="text"
                inputMode="numeric"
                onInput={handleInput(dayRef, 2, yearRef)}
                onKeyDown={handleKeyDown(monthRef)}
                onPaste={handlePaste}
                onBlur={onBlur}
                placeholder="DD"
                disabled={disabled}
                maxLength={2}
                className={`w-14 px-2 py-2 border-2 ${borderColor} rounded-lg focus:outline-none focus:ring-2 focus:ring-bold-blue font-work-sans text-center`}
            />
            <span className="text-gray-600">/</span>
            <input
                ref={yearRef}
                type="text"
                inputMode="numeric"
                onInput={handleInput(yearRef, 4, null)}
                onKeyDown={handleKeyDown(dayRef)}
                onPaste={handlePaste}
                onBlur={onBlur}
                placeholder="YYYY"
                disabled={disabled}
                maxLength={4}
                className={`w-20 px-2 py-2 border-2 ${borderColor} rounded-lg focus:outline-none focus:ring-2 focus:ring-bold-blue font-work-sans text-center`}
            />
        </div>
    );
};