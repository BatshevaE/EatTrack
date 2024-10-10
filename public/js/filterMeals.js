
    document.getElementById('filterBtn').addEventListener('click', function () {
        // Get the 'From' and 'To' date values
        var fromDateValue = document.getElementById('fromDate').value;
        var toDateValue = document.getElementById('toDate').value;

        if (fromDateValue && toDateValue) {
            // Convert them to Date objects for comparison
            var fromDate = new Date(fromDateValue);
            var toDate = new Date(toDateValue);

            // Get all table rows
            var rows = document.querySelectorAll('#mealTable tbody tr');
            
            // Loop through all rows and filter based on the date
            rows.forEach(function (row) {
                var dateCell = row.querySelector('.meal-date').textContent; // Get the date in the cell
                var mealDate = new Date(dateCell.split('/').reverse().join('-')); // Convert the date from DD/MM/YYYY to YYYY-MM-DD

                // Compare dates and hide rows that are outside the range
                if (mealDate >= fromDate && mealDate <= toDate) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        } else {
            alert('Please select both "From" and "To" dates.');
        }
    });

