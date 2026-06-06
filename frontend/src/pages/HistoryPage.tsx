import React, { useCallback, useEffect, useState } from "react";
import { getExpenses, createExpense } from "../services/api";
import { Expense, ExpenseFormData } from "../types";
import YearNavigation from "../components/YearNavigation";
import { MonthNavigation } from "../components/MonthNavigation";
import CategoryBreakdown from "../components/CategoryBreakdown";
import { CalendarExpenseTable } from "../components/CalendarExpenseTable";
import { ExpenseForm } from "../components/ExpenseForm";
import { Button } from "../vibes/Button";
import { Modal } from "../vibes/Modal";
import { COLORS } from "../constants/colors";
import { useCategories } from "../hooks/useCategories";

const pageStyle: React.CSSProperties = {
  padding: "48px 64px",
  minHeight: "100vh",
  background: COLORS.secondary.s01,
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "24px",
  justifyContent: "space-between",
};

const leftHeaderStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "24px",
};

const titleStyle: React.CSSProperties = {
  fontSize: "40px",
  fontWeight: 700,
  color: COLORS.secondary.s10,
  margin: 0,
  flexShrink: 0,
};

const loadingStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "48px",
  fontSize: "18px",
  color: COLORS.secondary.s08,
};

const categoryErrorStyle: React.CSSProperties = {
  margin: "16px 0 0",
  color: COLORS.danger,
  fontSize: "14px",
};

const tableContainerStyle: React.CSSProperties = {
  marginTop: "32px",
};

type YearMonth = {
  year: number;
  month: number;
};

const getCurrentYearMonth = (): YearMonth => {
  const currentDate = new Date();

  return {
    year: currentDate.getFullYear(),
    month: currentDate.getMonth() + 1,
  };
};

const clampYearMonth = (
  year: number,
  month: number,
  maxPeriod = getCurrentYearMonth(),
): YearMonth => {
  const selectedYear = Number.isFinite(year) ? year : maxPeriod.year;
  const selectedMonth =
    Number.isFinite(month) && month >= 1 && month <= 12
      ? month
      : maxPeriod.month;

  if (selectedYear > maxPeriod.year) {
    return maxPeriod;
  }

  if (selectedYear === maxPeriod.year && selectedMonth > maxPeriod.month) {
    return maxPeriod;
  }

  return { year: selectedYear, month: selectedMonth };
};

const getInitialYearMonth = () => {
  const params = new URLSearchParams(window.location.search);
  const current = getCurrentYearMonth();
  const yearParam = params.get("year");
  const monthParam = params.get("month");

  return clampYearMonth(
    yearParam ? parseInt(yearParam) : current.year,
    monthParam ? parseInt(monthParam) : current.month,
    current,
  );
};

const updateURL = (year: number, month: number) => {
  const params = new URLSearchParams();
  params.set("year", year.toString());
  params.set("month", month.toString());
  const newURL = `${window.location.pathname}?${params.toString()}`;
  if (`${window.location.pathname}${window.location.search}` === newURL) return;

  window.history.pushState({}, "", newURL);
};

const HistoryPage: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(() =>
    getInitialYearMonth(),
  );
  const {
    categories: availableCategories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  const current = getCurrentYearMonth();

  useEffect(() => {
    updateURL(selectedPeriod.year, selectedPeriod.month);
  }, [selectedPeriod.year, selectedPeriod.month]);

  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getExpenses(selectedPeriod.year, selectedPeriod.month);
      setExpenses(data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedPeriod.year, selectedPeriod.month]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const updateSelectedPeriod = (year: number, month: number) => {
    const next = clampYearMonth(year, month, current);
    setSelectedPeriod((previous) =>
      previous.year === next.year && previous.month === next.month
        ? previous
        : next,
    );
  };

  const handleYearChange = (year: number) => {
    updateSelectedPeriod(year, selectedPeriod.month);
  };

  const handleMonthChange = (month: number, year: number) => {
    updateSelectedPeriod(year, month);
  };

  const handleAddExpense = async (data: ExpenseFormData) => {
    try {
      await createExpense(data);
      setIsModalOpen(false);
      fetchExpenses();
    } catch (error) {
      console.error("Error creating expense:", error);
      throw error;
    }
  };

  // Calculate category breakdown
  const categoryData = expenses.reduce(
    (acc, expense) => {
      const category = expense.category || "Uncategorized";
      if (!acc[category]) {
        acc[category] = { category, amount: 0, count: 0 };
      }
      acc[category].amount += Number(expense.amount);
      acc[category].count += 1;
      return acc;
    },
    {} as Record<string, { category: string; amount: number; count: number }>,
  );

  const categories = Object.values(categoryData).sort(
    (a, b) => b.amount - a.amount,
  );
  const total = categories.reduce((sum, cat) => sum + cat.amount, 0);
  const totalCount = categories.reduce((sum, cat) => sum + cat.count, 0);
  const categoriesReady = !categoriesLoading && !categoriesError;

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <div style={leftHeaderStyle}>
          <h1 style={titleStyle}>Expense History</h1>
          <YearNavigation
            currentYear={selectedPeriod.year}
            maxYear={current.year}
            onYearChange={handleYearChange}
          />
        </div>
        <Button
          variant="primary"
          onClick={() => setIsModalOpen(true)}
          disabled={!categoriesReady}
        >
          Add Expense
        </Button>
      </div>
      {categoriesError && (
        <p style={categoryErrorStyle}>
          Expense categories could not be loaded. Add and edit are unavailable.
        </p>
      )}

      <MonthNavigation
        currentMonth={selectedPeriod.month}
        currentYear={selectedPeriod.year}
        maxMonth={current.month}
        maxYear={current.year}
        onMonthChange={handleMonthChange}
      />

      <div>
        {loading ? (
          <div style={loadingStyle}>Loading...</div>
        ) : (
          <>
            <CategoryBreakdown
              categories={categories}
              total={total}
              totalCount={totalCount}
            />
            <div style={tableContainerStyle}>
              <CalendarExpenseTable
                categories={availableCategories}
                categoriesReady={categoriesReady}
                expenses={expenses}
                onExpenseUpdated={fetchExpenses}
              />
            </div>
          </>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Expense"
      >
        {categoriesLoading ? (
          <div style={loadingStyle}>Loading categories...</div>
        ) : categoriesError ? (
          <p style={categoryErrorStyle}>{categoriesError}</p>
        ) : (
          <ExpenseForm
            categories={availableCategories}
            onSubmit={handleAddExpense}
            onCancel={() => setIsModalOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
};

export default HistoryPage;
