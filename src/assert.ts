export function assert(condition: boolean): asserts condition {
    if (condition) {
        return
    }
    console.error("Assertion failure")
    alert("Assertion failure, check console")
}
