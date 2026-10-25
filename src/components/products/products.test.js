import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Products from "./products";

test("shows the dashboard after selecting a school", async () => {
    render(<Products />);

    expect(screen.queryByRole("heading", { name: /recently found items/i })).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Your school"), {
        target: { value: "Ben Franklin Elementary" },
    });

    expect(screen.getByRole("heading", { name: /recently found items/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Ben Franklin Elementary" })).toBeInTheDocument();
    await waitFor(() => expect(screen.getAllByRole("button", { name: /redeem/i })).toHaveLength(2));
});

test("filters items and submits a redemption request", async () => {
    render(<Products />);
    fireEvent.change(screen.getByLabelText("Your school"), {
        target: { value: "Southwood Glen Elementary" },
    });

    await screen.findByRole("heading", { name: "Wireless headphones" });
    fireEvent.change(screen.getByPlaceholderText("Please provide summary"), {
        target: { value: "headphones" },
    });
    expect(screen.getAllByRole("button", { name: /redeem/i })).toHaveLength(1);

    fireEvent.click(screen.getByRole("button", { name: /redeem/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/child name/i), { target: { value: "Taylor Student" } });
    fireEvent.change(screen.getByLabelText(/child student id/i), { target: { value: "12345" } });
    fireEvent.change(screen.getByLabelText(/child teacher/i), { target: { value: "Ms. Rivera" } });
    fireEvent.click(screen.getByRole("button", { name: /submit request/i }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(/request for wireless headphones has been submitted/i);
});

test("shows only the selected school's items and images", async () => {
    render(<Products />);
    const schoolPicker = screen.getByLabelText("Your school");

    fireEvent.change(schoolPicker, {
        target: { value: "Ben Franklin Elementary" },
    });
    await screen.findByRole("heading", { name: "Blue water bottle" });

    fireEvent.change(schoolPicker, {
        target: { value: "Country Dale Elementary" },
    });

    await waitFor(() => {
        expect(screen.getByRole("heading", { name: "Purple knit hat" })).toBeInTheDocument();
        expect(screen.queryByRole("heading", { name: "Blue water bottle" })).not.toBeInTheDocument();
        expect(screen.getAllByRole("button", { name: /redeem/i })).toHaveLength(2);
        expect(screen.getByAltText("Purple knit hat")).toHaveAttribute(
            "src",
            expect.stringContaining("images.unsplash.com")
        );
    });
});
