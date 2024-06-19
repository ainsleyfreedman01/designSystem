import java.util.Arrays;

class InsertionSort {
  public static void sort(int[] array) {
   for (int i = 1; i < array.length; i++) { 
   // 0th element of original array is automatically put in sorted array
     int current = array[i];
     int j = i-1;
     while (j >= 0 && array[j] > current) { //starting from end of sorted array and working backwards
     /*
     stop at front of array or if next element in sorted array 
     is less than element we are trying to sort
     */
       array[j+1]=array[j]; //shifting element one spot to the right
       j--;
     }
     array[j+1]=current; 
     //current stays the same! (it has been shifted to the right one, so we add 1)
    
   }
  }
  public static void main(String[] args) {
    int[] numbers = {7, 2, 14, -7, 72};
    System.out.println("Array in ascending order");
    sort(numbers);
    System.out.println(Arrays.toString(numbers));
  }
}