        </div> <!-- End of Body Area -->
    </main>

    <!-- Modal Open/Close Script Helper (Zero Dependency) -->
    <script>
        function openModal(id) {
            const m = document.getElementById(id);
            if (m) {
                m.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            }
        }
        function closeModal(id) {
            const m = document.getElementById(id);
            if (m) {
                m.classList.add('hidden');
                document.body.style.overflow = '';
            }
        }
    </script>
</body>
</html>
